import {
  actualizarFicha,
  agregarASeleccion,
  CLAVES,
  cambiarEstadoSolicitud,
  crearFicha,
  crearSolicitud,
  eliminarFicha,
  eliminarSolicitud,
  estaSeleccionado,
  listarFichas,
  listarSeleccion,
  listarSolicitudes,
  obtenerFicha,
  obtenerSolicitud,
  quitarDeSeleccion,
  restablecerDatos,
  suscribir,
  vaciarSeleccion,
} from "@/lib/baseDatos";
import { SIN_PARENTESCO } from "@/lib/opciones";
import { cuotaRosa, direccionValida, fichaAlDia, pensionRaul, solicitanteValido } from "./datos";

const nuevaFicha = { ...fichaAlDia, id: "10000013-K", nombre: "Ficha de Prueba Ficticia" };
const FECHA = "2026-10-28T12:00:00.000Z";

function estadoBeneficio(rut: string, nombre: string) {
  return obtenerFicha(rut)!.beneficios.find((b) => b.nombre === nombre)!.estado;
}

describe("lib/baseDatos: fichas (CRUD)", () => {
  it("Leer: parte con las 8 fichas iniciales", () => {
    expect(listarFichas().length).toBe(8);
    expect(obtenerFicha("44444444-4")!.nombre).toBe("Héctor Andrés Valenzuela Rojas");
    expect(obtenerFicha("12345678-5")).toBeUndefined();
  });

  it("Crear: agrega la ficha y la guarda en localStorage", () => {
    crearFicha(nuevaFicha);

    expect(listarFichas().length).toBe(9);
    const guardado = JSON.parse(localStorage.getItem(CLAVES.fichas)!);
    expect(guardado.at(-1).id).toBe("10000013-K");
  });

  it("Crear: no permite un RUT repetido", () => {
    expect(() => crearFicha({ ...fichaAlDia, id: "11111111-1" })).toThrowError(/Ya existe/);
    expect(listarFichas().length).toBe(8);
  });

  it("Actualizar: cambia los datos pero mantiene el RUT", () => {
    const actualizada = actualizarFicha("22222222-2", { ...fichaAlDia, id: "99999999-9", nombre: "Nombre Editado" });

    expect(actualizada.id).toBe("22222222-2");
    expect(obtenerFicha("22222222-2")!.nombre).toBe("Nombre Editado");
    expect(obtenerFicha("99999999-9")).toBeUndefined();
  });

  it("Actualizar: lanza error si la ficha no existe", () => {
    expect(() => actualizarFicha("12345678-5", fichaAlDia)).toThrowError(/No existe/);
  });

  it("Eliminar: borra la ficha y la saca de la solicitud en preparación", () => {
    agregarASeleccion(cuotaRosa);

    expect(eliminarFicha("11111111-1")).toBeTrue();
    expect(obtenerFicha("11111111-1")).toBeUndefined();
    expect(listarSeleccion().length).toBe(0);
    expect(eliminarFicha("11111111-1")).toBeFalse();
  });

  it("restablecerDatos vuelve a los datos iniciales", () => {
    crearFicha(nuevaFicha);
    restablecerDatos();
    expect(listarFichas().length).toBe(8);
    expect(localStorage.getItem(CLAVES.fichas)).toBeNull();
  });
});

describe("lib/baseDatos: persistencia y mocks de localStorage", () => {
  it("si otra pestaña cambia el localStorage, lee los datos nuevos y avisa", () => {
    const oyente = jasmine.createSpy("oyente");
    const desuscribir = suscribir(oyente);
    listarFichas();

    localStorage.setItem(CLAVES.fichas, JSON.stringify([nuevaFicha]));
    window.dispatchEvent(new StorageEvent("storage", { key: CLAVES.fichas }));

    expect(oyente).toHaveBeenCalled();
    expect(listarFichas().map((f) => f.id)).toEqual(["10000013-K"]);
    desuscribir();
  });

  it("un evento storage sin clave (localStorage.clear en otra pestaña) recarga todo", () => {
    const oyente = jasmine.createSpy("oyente");
    const desuscribir = suscribir(oyente);
    crearFicha(nuevaFicha);
    oyente.calls.reset();

    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));

    expect(oyente).toHaveBeenCalledTimes(1);
    expect(listarFichas().length).toBe(8);
    desuscribir();
  });

  it("ignora eventos storage de otras claves", () => {
    const oyente = jasmine.createSpy("oyente");
    const desuscribir = suscribir(oyente);
    window.dispatchEvent(new StorageEvent("storage", { key: "otra.cosa" }));
    expect(oyente).not.toHaveBeenCalled();
    desuscribir();
  });

  it("después de desuscribirse ya no recibe avisos", () => {
    const oyente = jasmine.createSpy("oyente");
    const desuscribir = suscribir(oyente);
    crearFicha(nuevaFicha);
    expect(oyente).toHaveBeenCalledTimes(1);

    desuscribir();
    vaciarSeleccion();
    expect(oyente).toHaveBeenCalledTimes(1);
  });

  it("si localStorage falla al leer (mock), usa los datos iniciales", () => {
    spyOn(Storage.prototype, "getItem").and.throwError("bloqueado");
    restablecerDatos();
    expect(listarFichas().length).toBe(8);
  });

  it("si localStorage tiene datos malos, usa los datos iniciales", () => {
    localStorage.setItem(CLAVES.fichas, "{esto no es json");
    expect(listarFichas().length).toBe(8);
  });

  it("si localStorage falla al guardar (mock), el cambio queda igual en memoria", () => {
    spyOn(Storage.prototype, "setItem").and.throwError("lleno");
    crearFicha(nuevaFicha);
    expect(obtenerFicha("10000013-K")).toBeDefined();
  });

  it("si localStorage falla al borrar (mock), restablecerDatos no se cae", () => {
    spyOn(Storage.prototype, "removeItem").and.throwError("bloqueado");
    expect(() => restablecerDatos()).not.toThrow();
  });
});

describe("lib/baseDatos: selección de beneficios (carrito)", () => {
  it("agrega, no duplica, quita y vacía", () => {
    expect(agregarASeleccion(cuotaRosa)).toBeTrue();
    expect(agregarASeleccion(cuotaRosa)).toBeFalse();
    agregarASeleccion(pensionRaul);
    expect(listarSeleccion().length).toBe(2);
    expect(estaSeleccionado("66666666-6", "Pensión de sobrevivencia")).toBeTrue();

    quitarDeSeleccion("66666666-6", "Pensión de sobrevivencia");
    expect(estaSeleccionado("66666666-6", "Pensión de sobrevivencia")).toBeFalse();

    vaciarSeleccion();
    expect(listarSeleccion()).toEqual([]);
  });
});

describe("lib/baseDatos: solicitudes", () => {
  it("una solicitud de un familiar queda ingresada, marca los beneficios y vacía la selección", () => {
    agregarASeleccion(cuotaRosa);
    agregarASeleccion(pensionRaul);

    const solicitud = crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: listarSeleccion(), fecha: FECHA });

    expect(solicitud.id).toBe("SOL-0001");
    expect(solicitud.estado).toBe("ingresada");
    expect(solicitud.total).toBe(930000);
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("solicitado");
    expect(listarSeleccion().length).toBe(0);
    expect(obtenerSolicitud("SOL-0001")).toEqual(solicitud);
  });

  it("si el solicitante no tiene parentesco, queda rechazada y la selección se mantiene", () => {
    agregarASeleccion(cuotaRosa);
    const solicitud = crearSolicitud({
      solicitante: { ...solicitanteValido, parentesco: SIN_PARENTESCO },
      direccion: direccionValida,
      items: listarSeleccion(),
      fecha: FECHA,
    });

    expect(solicitud.estado).toBe("rechazada");
    expect(solicitud.motivo).toContain("familiar directo");
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("pendiente");
    expect(listarSeleccion().length).toBe(1);
  });

  it("los números de solicitud son correlativos", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    const segunda = crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [pensionRaul], fecha: FECHA });
    expect(segunda.id).toBe("SOL-0002");
    expect(listarSolicitudes().length).toBe(2);
  });

  it("si hay una solicitud con un número raro, igual sigue la numeración", () => {
    localStorage.setItem(CLAVES.solicitudes, JSON.stringify([{ id: "PRUEBA", estado: "aprobada", items: [] }]));
    window.dispatchEvent(new StorageEvent("storage", { key: CLAVES.solicitudes }));
    const solicitud = crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    expect(solicitud.id).toBe("SOL-0001");
  });

  it("no se puede crear una solicitud sin beneficios", () => {
    expect(() => crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [], fecha: FECHA })).toThrowError(/no tiene beneficios/);
  });

  it("aprobar deja los beneficios cobrados", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    const aprobada = cambiarEstadoSolicitud("SOL-0001", "aprobada");

    expect(aprobada.estado).toBe("aprobada");
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("cobrado");
  });

  it("rechazar devuelve los beneficios a pendiente y guarda el motivo", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    const rechazada = cambiarEstadoSolicitud("SOL-0001", "rechazada", "Faltan documentos");

    expect(rechazada.motivo).toBe("Faltan documentos");
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("pendiente");
  });

  it("no se puede revisar dos veces ni revisar una que no existe", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    cambiarEstadoSolicitud("SOL-0001", "aprobada");

    expect(() => cambiarEstadoSolicitud("SOL-0001", "rechazada")).toThrowError(/ya fue revisada/);
    expect(() => cambiarEstadoSolicitud("SOL-9999", "aprobada")).toThrowError(/No existe/);
  });

  it("eliminar una solicitud en revisión libera los beneficios", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });

    expect(eliminarSolicitud("SOL-0001")).toBeTrue();
    expect(listarSolicitudes().length).toBe(0);
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("pendiente");
    expect(eliminarSolicitud("SOL-0001")).toBeFalse();
  });

  it("eliminar una solicitud ya aprobada no cambia los beneficios", () => {
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: FECHA });
    cambiarEstadoSolicitud("SOL-0001", "aprobada");
    eliminarSolicitud("SOL-0001");
    expect(estadoBeneficio("11111111-1", "Cuota mortuoria")).toBe("cobrado");
  });
});
