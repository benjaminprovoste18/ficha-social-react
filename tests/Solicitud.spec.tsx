import ArmadorSolicitud from "@/components/ArmadorSolicitud";
import BotonAgregarSolicitud from "@/components/BotonAgregarSolicitud";
import EnlaceSolicitud from "@/components/EnlaceSolicitud";
import FormularioSolicitud from "@/components/FormularioSolicitud";
import ResultadoSolicitud from "@/components/ResultadoSolicitud";
import ResumenSolicitud from "@/components/ResumenSolicitud";
import SelectorRegionComuna from "@/components/SelectorRegionComuna";
import TablaSeleccion from "@/components/TablaSeleccion";
import { agregarASeleccion, crearSolicitud, listarSeleccion, listarSolicitudes } from "@/lib/baseDatos";
import { SIN_PARENTESCO } from "@/lib/opciones";
import { cuotaRosa, direccionValida, pensionRaul, solicitanteValido } from "./datos";
import { routerFalso } from "./mocks/next-navigation";
import { boton, elegir, enAct, escribir, hacerClick, renderizar } from "./utils/renderizar";

const FECHA = new Date(2026, 9, 28, 21, 5).toISOString();

describe("TablaSeleccion (renderizado de listas)", () => {
  it("dibuja una fila por beneficio y el total", () => {
    const contenedor = renderizar(<TablaSeleccion items={[cuotaRosa, pensionRaul]} />);

    expect(contenedor.querySelectorAll("tbody tr").length).toBe(2);
    expect(contenedor.querySelector("#total-seleccion")!.textContent).toBe("$930.000");
    expect(contenedor.querySelector("button")).toBeNull();
  });

  it("muestra el mensaje cuando la lista está vacía", () => {
    const contenedor = renderizar(<TablaSeleccion items={[]} mensajeVacio="Nada aún" />);
    expect(contenedor.querySelector("table")).toBeNull();
    expect(contenedor.textContent).toBe("Nada aún");
  });

  it("el botón Quitar llama a onQuitar con el beneficio de su fila", () => {
    const alQuitar = jasmine.createSpy("onQuitar");
    const contenedor = renderizar(<TablaSeleccion items={[cuotaRosa, pensionRaul]} onQuitar={alQuitar} />);

    hacerClick(contenedor.querySelectorAll("tbody button")[1]);
    expect(alQuitar).toHaveBeenCalledOnceWith(pensionRaul);
  });
});

describe("BotonAgregarSolicitud y EnlaceSolicitud (eventos)", () => {
  it("al hacer click agrega el beneficio, cambia el botón y el contador del menú sube", () => {
    const contenedor = renderizar(
      <>
        <EnlaceSolicitud />
        <BotonAgregarSolicitud item={cuotaRosa} />
      </>
    );
    expect(contenedor.querySelector("#enlace-solicitud .badge")!.textContent).toBe("0");

    hacerClick(boton(contenedor, "Agregar a solicitud"));

    expect(listarSeleccion()).toEqual([cuotaRosa]);
    expect(contenedor.querySelector("#enlace-solicitud .badge")!.textContent).toBe("1");

    hacerClick(boton(contenedor, "Quitar de la solicitud"));
    expect(listarSeleccion()).toEqual([]);
    expect(contenedor.querySelector("#enlace-solicitud .badge")!.textContent).toBe("0");
  });
});

describe("ArmadorSolicitud (vista carrito)", () => {
  it("muestra los 4 beneficios pendientes de los datos iniciales", () => {
    const contenedor = renderizar(<ArmadorSolicitud />);
    expect(contenedor.querySelectorAll("#beneficios-disponibles .card").length).toBe(4);
    expect(contenedor.textContent).toContain("Todavía no agregas beneficios.");
    expect(boton(contenedor, "Continuar con mis datos").disabled).toBeTrue();
  });

  it("al agregar aparece en la solicitud con su total, y Limpiar la vacía", () => {
    const contenedor = renderizar(<ArmadorSolicitud />);

    hacerClick(contenedor.querySelector("#beneficios-disponibles button"));
    expect(contenedor.querySelector("#total-seleccion")!.textContent).toBe("$650.000");
    expect(contenedor.querySelector('a[href="/solicitud/datos"]')).not.toBeNull();

    hacerClick(contenedor.querySelector("tbody button"));
    expect(listarSeleccion().length).toBe(0);

    hacerClick(contenedor.querySelector("#beneficios-disponibles button"));
    hacerClick(boton(contenedor, "Limpiar"));
    expect(listarSeleccion().length).toBe(0);
  });

  it("avisa cuando ya no quedan beneficios pendientes", () => {
    enAct(() => {
      crearSolicitud({
        solicitante: solicitanteValido,
        direccion: direccionValida,
        fecha: FECHA,
        items: [
          cuotaRosa,
          pensionRaul,
          { rut: "44444444-4", nombreFallecido: "Héctor", beneficio: "Seguro de desgravamen", monto: 18400000 },
          { rut: "88888888-8", nombreFallecido: "Óscar", beneficio: "Cuota mortuoria", monto: 650000 },
        ],
      });
    });
    const contenedor = renderizar(<ArmadorSolicitud />);
    expect(contenedor.textContent).toContain("No quedan beneficios pendientes.");
  });
});

describe("SelectorRegionComuna (selects encadenados)", () => {
  it("la comuna está deshabilitada hasta elegir región", () => {
    const contenedor = renderizar(<SelectorRegionComuna idPrefijo="x" region="" comuna="" onCambio={() => {}} />);
    expect((contenedor.querySelector("#x-comuna") as HTMLSelectElement).disabled).toBeTrue();
  });

  it("al cambiar la región borra la comuna, y al elegir comuna mantiene la región", () => {
    const alCambiar = jasmine.createSpy("onCambio");
    const contenedor = renderizar(
      <SelectorRegionComuna idPrefijo="x" region="Maule" comuna="Talca" onCambio={alCambiar} errorComuna="Elige una" />
    );

    expect(contenedor.querySelectorAll("#x-comuna option").length).toBe(5);
    elegir(contenedor.querySelector("#x-region"), "Ñuble");
    expect(alCambiar).toHaveBeenCalledWith("Ñuble", "");
    elegir(contenedor.querySelector("#x-comuna"), "Curicó");
    expect(alCambiar).toHaveBeenCalledWith("Maule", "Curicó");
    expect(contenedor.textContent).toContain("Elige una");
  });
});

describe("FormularioSolicitud (checkout)", () => {
  let espiaPush: jasmine.Spy;

  beforeEach(() => {
    espiaPush = spyOn(routerFalso, "push");
  });

  function llenar(contenedor: HTMLElement, parentesco: string) {
    escribir(contenedor.querySelector("#nombres"), solicitanteValido.nombres);
    escribir(contenedor.querySelector("#apellidos"), solicitanteValido.apellidos);
    escribir(contenedor.querySelector("#rut-solicitante"), "22.222.222-2");
    escribir(contenedor.querySelector("#correo"), " carmen@correo.cl ");
    elegir(contenedor.querySelector("#parentesco"), parentesco);
    escribir(contenedor.querySelector("#calle"), "Av. Ficticia 123");
    escribir(contenedor.querySelector("#depto"), "603");
    elegir(contenedor.querySelector("#direccion-region"), "Valparaíso");
    elegir(contenedor.querySelector("#direccion-comuna"), "Viña del Mar");
    escribir(contenedor.querySelector("#indicaciones"), "Llamar antes");
  }

  it("el estado del formulario cambia cuando el usuario escribe", () => {
    const contenedor = renderizar(<FormularioSolicitud />);
    const nombres = contenedor.querySelector("#nombres") as HTMLInputElement;

    escribir(nombres, "Carmen");
    expect(nombres.value).toBe("Carmen");
  });

  it("enviado vacío muestra los errores y no guarda nada", () => {
    const contenedor = renderizar(<FormularioSolicitud />);

    hacerClick(contenedor.querySelector("button[type=submit]"));

    expect(contenedor.querySelectorAll(".invalid-feedback").length).toBe(8);
    expect(contenedor.querySelector(".alert-danger")!.textContent).toContain("Agrega al menos un beneficio");
    expect(espiaPush).not.toHaveBeenCalled();
    expect(listarSolicitudes().length).toBe(0);
  });

  it("con datos correctos guarda la solicitud y va a la página de éxito", () => {
    enAct(() => agregarASeleccion(cuotaRosa));
    const contenedor = renderizar(<FormularioSolicitud ahora={() => FECHA} />);
    expect(contenedor.querySelector("#total-solicitud")!.textContent).toBe("Total: $650.000");

    llenar(contenedor, "Hijo o hija");
    hacerClick(contenedor.querySelector("button[type=submit]"));

    const guardada = listarSolicitudes()[0];
    expect(guardada.solicitante.rut).toBe("22222222-2");
    expect(guardada.solicitante.correo).toBe("carmen@correo.cl");
    expect(guardada.direccion.comuna).toBe("Viña del Mar");
    expect(espiaPush).toHaveBeenCalledOnceWith("/solicitud/exitosa/SOL-0001");
  });

  it("si el solicitante no tiene parentesco va a la página de rechazo", () => {
    enAct(() => agregarASeleccion(cuotaRosa));
    const contenedor = renderizar(<FormularioSolicitud />);

    llenar(contenedor, SIN_PARENTESCO);
    hacerClick(contenedor.querySelector("button[type=submit]"));

    expect(espiaPush).toHaveBeenCalledOnceWith("/solicitud/rechazada/SOL-0001");
  });
});

describe("ResumenSolicitud y ResultadoSolicitud", () => {
  function crear(parentesco = "Cónyuge", conExtras = false) {
    let id = "";
    enAct(() => {
      id = crearSolicitud({
        solicitante: { ...solicitanteValido, parentesco },
        direccion: conExtras ? { ...direccionValida, depto: "603", indicaciones: "Llamar antes" } : direccionValida,
        items: [cuotaRosa],
        fecha: FECHA,
      }).id;
    });
    return id;
  }

  it("el resumen muestra los datos y solo muestra depto e indicaciones si existen", () => {
    crear("Cónyuge", true);
    const conExtras = renderizar(<ResumenSolicitud solicitud={listarSolicitudes()[0]} />);
    expect(conExtras.textContent).toContain("Av. Ficticia 123, depto 603, Viña del Mar, Valparaíso");
    expect(conExtras.textContent).toContain("Llamar antes");
    expect(conExtras.textContent).toContain("28-10-2026 21:05");

    const sinExtras = renderizar(<ResumenSolicitud solicitud={{ ...listarSolicitudes()[0], direccion: direccionValida }} />);
    expect(sinExtras.textContent).not.toContain("Indicaciones");
  });

  it("la página de éxito muestra el número y el mensaje verde", () => {
    const id = crear();
    const contenedor = renderizar(<ResultadoSolicitud id={id} tipo="exitosa" />);

    expect(contenedor.querySelector("#resultado")!.classList).toContain("alert-success");
    expect(contenedor.querySelector("h2")!.textContent).toBe("Solicitud ingresada N° SOL-0001");
    expect(contenedor.querySelector('a[href="/solicitud/datos"]')).toBeNull();
  });

  it("la página de rechazo muestra el motivo y el botón para volver a intentar", () => {
    const id = crear(SIN_PARENTESCO);
    const contenedor = renderizar(<ResultadoSolicitud id={id} tipo="rechazada" />);

    expect(contenedor.querySelector("#resultado")!.classList).toContain("alert-danger");
    expect(contenedor.textContent).toContain("familiar directo");
    expect(contenedor.querySelector('a[href="/solicitud/datos"]')!.textContent).toBe("Volver a intentar");
  });

  it("avisa si la solicitud no existe", () => {
    const contenedor = renderizar(<ResultadoSolicitud id="SOL-9999" tipo="exitosa" />);
    expect(contenedor.textContent).toContain("No encontramos la solicitud SOL-9999");
  });
});
