import {
  fichaAFormulario,
  formularioAFicha,
  formularioVacio,
  validarFicha,
  type FichaFormulario,
} from "@/lib/fichaFormulario";
import { aSlug, comunasDe, regionPorSlug, REGIONES, SIN_PARENTESCO } from "@/lib/opciones";
import { motivoRechazo, validarCorreo, validarSolicitud } from "@/lib/validaciones";
import type { Ficha } from "@/lib/tipos";
import { direccionValida, fichaConPendientes, solicitanteValido } from "./datos";

const HOY = "2026-10-28";
const opcionesNueva = { esNueva: true, rutsExistentes: ["11111111-1"], hoy: HOY };

function formularioValido(): FichaFormulario {
  return {
    ...formularioVacio(),
    id: "10.000.013-k",
    nombre: "Pedro Prueba Ficticio",
    fechaNacimiento: "1950-05-10",
    fechaDefuncion: "2026-02-01",
    region: "Maule",
    comuna: "Talca",
    estadoCivil: "Viudo",
  };
}

describe("lib/validaciones: solicitud", () => {
  it("validarCorreo acepta correos normales y rechaza los mal escritos", () => {
    expect(validarCorreo("nombre@correo.cl")).toBeTrue();
    expect(validarCorreo("nombre@correo")).toBeFalse();
    expect(validarCorreo("sin arroba.cl")).toBeFalse();
  });

  it("motivoRechazo solo rechaza a quien no tiene parentesco", () => {
    expect(motivoRechazo(solicitanteValido)).toBe("");
    expect(motivoRechazo({ ...solicitanteValido, parentesco: SIN_PARENTESCO })).toContain("familiar directo");
  });

  it("validarSolicitud con todo vacío marca todos los campos obligatorios", () => {
    const vacio = { nombres: "", apellidos: "", rut: "", correo: "", parentesco: "" };
    const sinDireccion = { calle: "", depto: "", region: "", comuna: "", indicaciones: "" };
    const errores = validarSolicitud(vacio, sinDireccion, 0);

    expect(Object.keys(errores).sort()).toEqual(
      ["apellidos", "beneficios", "calle", "comuna", "correo", "nombres", "parentesco", "region", "rut"].sort()
    );
  });

  it("validarSolicitud con datos correctos no tiene errores", () => {
    expect(validarSolicitud(solicitanteValido, direccionValida, 2)).toEqual({});
  });

  it("validarSolicitud avisa si el correo o el RUT están malos", () => {
    const errores = validarSolicitud({ ...solicitanteValido, correo: "malo@", rut: "22222222-3" }, direccionValida, 1);
    expect(errores.correo).toBe("El correo no tiene un formato válido.");
    expect(errores.rut).toBe("El dígito verificador no es correcto.");
  });
});

describe("lib/fichaFormulario", () => {
  it("una ficha pasa a formulario (texto) y vuelve igual", () => {
    const formulario = fichaAFormulario(fichaConPendientes);

    expect(formulario.bienes[0].avaluo).toBe("48500000");
    expect(formularioAFicha(formulario)).toEqual(fichaConPendientes);
  });

  it("al guardar limpia el RUT y convierte los montos a número", () => {
    const formulario = { ...formularioValido(), beneficios: [{ nombre: "Cuota mortuoria", monto: " 650000 ", estado: "pendiente" }] };
    const ficha = formularioAFicha(formulario);

    expect(ficha.id).toBe("10000013-K");
    expect(ficha.beneficios[0].monto).toBe(650000);
  });

  it("si a una fila le falta un campo, queda como texto vacío", () => {
    const fichaIncompleta = { ...fichaConPendientes, documentos: [{ nombre: "Certificado" }] } as unknown as Ficha;
    expect(fichaAFormulario(fichaIncompleta).documentos[0]).toEqual({ nombre: "Certificado", estado: "" });

    const formulario = { ...formularioValido(), documentos: [{ nombre: "Certificado" }] };
    expect(formularioAFicha(formulario).documentos[0]).toEqual({ nombre: "Certificado", estado: "" as never });
  });

  it("un formulario nuevo vacío tiene errores en todos los datos obligatorios", () => {
    const errores = validarFicha(formularioVacio(), opcionesNueva);
    expect(Object.keys(errores).sort()).toEqual(
      ["comuna", "estadoCivil", "fechaDefuncion", "fechaNacimiento", "id", "nombre", "region"].sort()
    );
  });

  it("un formulario completo no tiene errores", () => {
    expect(validarFicha(formularioValido(), opcionesNueva)).toEqual({});
  });

  it("no permite crear una ficha con un RUT que ya existe", () => {
    const errores = validarFicha({ ...formularioValido(), id: "11.111.111-1" }, opcionesNueva);
    expect(errores.id).toBe("Ya existe una ficha con este RUT.");
  });

  it("al editar no valida el RUT", () => {
    const errores = validarFicha({ ...formularioValido(), id: "" }, { ...opcionesNueva, esNueva: false });
    expect(errores.id).toBeUndefined();
  });

  it("la defunción no puede ser futura ni anterior al nacimiento", () => {
    expect(validarFicha({ ...formularioValido(), fechaDefuncion: "2027-01-01" }, opcionesNueva).fechaDefuncion).toContain("futura");
    expect(validarFicha({ ...formularioValido(), fechaDefuncion: "1940-01-01" }, opcionesNueva).fechaDefuncion).toContain("anterior");
  });

  it("revisa cada fila de las listas: obligatorios y montos enteros", () => {
    const formulario = {
      ...formularioValido(),
      deudas: [{ institucion: "", monto: "12.5", estado: "pendiente" }],
    };
    const errores = validarFicha(formulario, opcionesNueva);

    expect(errores["deudas.0.institucion"]).toBe("Obligatorio.");
    expect(errores["deudas.0.monto"]).toBe("Solo números enteros.");
    expect(errores["deudas.0.estado"]).toBeUndefined();
  });

  it("una fila sin un campo se marca como obligatoria", () => {
    const errores = validarFicha({ ...formularioValido(), documentos: [{ nombre: "Certificado" }] }, opcionesNueva);
    expect(errores["documentos.0.estado"]).toBe("Obligatorio.");
  });
});

describe("lib/opciones", () => {
  it("tiene las 16 regiones y cada una con comunas", () => {
    expect(REGIONES.length).toBe(16);
    expect(comunasDe("Maule")).toContain("Talca");
    expect(comunasDe("No existe")).toEqual([]);
  });

  it("aSlug arma textos para la URL sin tildes ni símbolos", () => {
    expect(aSlug("La Araucanía")).toBe("la-araucania");
    expect(aSlug("O'Higgins")).toBe("o-higgins");
    expect(regionPorSlug("nuble")!.nombre).toBe("Ñuble");
    expect(regionPorSlug("marte")).toBeUndefined();
  });
});
