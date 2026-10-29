import type { Errores, Ficha } from "./tipos";
import { limpiarRut, validarRut } from "./validaciones";

// En el formulario todo se maneja como texto (los inputs siempre devuelven texto)
// y al guardar se convierte a Ficha con numeros.

export type FilaEditable = Record<string, string>;

export type ListaFicha = "familia" | "bienes" | "deudas" | "beneficios" | "documentos";

export type FichaFormulario = {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  fechaDefuncion: string;
  comuna: string;
  region: string;
  estadoCivil: string;
} & Record<ListaFicha, FilaEditable[]>;

// Que campos tiene cada fila de cada lista, y cuales son numericos
export const CAMPOS_LISTA: Record<ListaFicha, { claves: string[]; numericos: string[] }> = {
  familia: { claves: ["nombre", "parentesco"], numericos: [] },
  bienes: { claves: ["tipo", "descripcion", "avaluo"], numericos: ["avaluo"] },
  deudas: { claves: ["institucion", "monto", "estado"], numericos: ["monto"] },
  beneficios: { claves: ["nombre", "monto", "estado"], numericos: ["monto"] },
  documentos: { claves: ["nombre", "estado"], numericos: [] },
};

const LISTAS = Object.keys(CAMPOS_LISTA) as ListaFicha[];

export function formularioVacio(): FichaFormulario {
  return {
    id: "",
    nombre: "",
    fechaNacimiento: "",
    fechaDefuncion: "",
    comuna: "",
    region: "",
    estadoCivil: "",
    familia: [],
    bienes: [],
    deudas: [],
    beneficios: [],
    documentos: [],
  };
}

export function fichaAFormulario(ficha: Ficha): FichaFormulario {
  const formulario: FichaFormulario = {
    ...formularioVacio(),
    id: ficha.id,
    nombre: ficha.nombre,
    fechaNacimiento: ficha.fechaNacimiento,
    fechaDefuncion: ficha.fechaDefuncion,
    comuna: ficha.comuna,
    region: ficha.region,
    estadoCivil: ficha.estadoCivil,
  };
  LISTAS.forEach((lista) => {
    const filas = ficha[lista] as unknown as Record<string, string | number>[];
    formulario[lista] = filas.map((fila) => {
      const texto: FilaEditable = {};
      CAMPOS_LISTA[lista].claves.forEach((clave) => (texto[clave] = String(fila[clave] ?? "")));
      return texto;
    });
  });
  return formulario;
}

export function formularioAFicha(formulario: FichaFormulario): Ficha {
  const ficha: Record<string, unknown> = {
    id: limpiarRut(formulario.id),
    nombre: formulario.nombre.trim(),
    fechaNacimiento: formulario.fechaNacimiento,
    fechaDefuncion: formulario.fechaDefuncion,
    comuna: formulario.comuna,
    region: formulario.region,
    estadoCivil: formulario.estadoCivil,
  };
  LISTAS.forEach((lista) => {
    ficha[lista] = formulario[lista].map((fila) => {
      const valor: Record<string, string | number> = {};
      CAMPOS_LISTA[lista].claves.forEach((clave) => {
        const texto = (fila[clave] ?? "").trim();
        valor[clave] = CAMPOS_LISTA[lista].numericos.includes(clave) ? Number(texto) : texto;
      });
      return valor;
    });
  });
  return ficha as unknown as Ficha;
}

type OpcionesValidacion = {
  esNueva: boolean;
  rutsExistentes: string[];
  hoy: string; // "AAAA-MM-DD", se pasa desde afuera para poder probarlo
};

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Valida el formulario de ficha del panel de administracion.
// Las claves de los errores de las listas son del tipo "bienes.0.avaluo".
export function validarFicha(formulario: FichaFormulario, opciones: OpcionesValidacion): Errores {
  const errores: Errores = {};

  if (opciones.esNueva) {
    const rut = validarRut(formulario.id);
    if (!rut.valido) errores.id = rut.mensaje;
    else if (opciones.rutsExistentes.includes(limpiarRut(formulario.id))) {
      errores.id = "Ya existe una ficha con este RUT.";
    }
  }

  if (formulario.nombre.trim().length < 3) errores.nombre = "Ingresa el nombre completo.";

  if (!FECHA.test(formulario.fechaNacimiento)) errores.fechaNacimiento = "Ingresa la fecha de nacimiento.";
  if (!FECHA.test(formulario.fechaDefuncion)) {
    errores.fechaDefuncion = "Ingresa la fecha de defunción.";
  } else if (formulario.fechaDefuncion > opciones.hoy) {
    errores.fechaDefuncion = "La fecha de defunción no puede ser futura.";
  } else if (FECHA.test(formulario.fechaNacimiento) && formulario.fechaDefuncion < formulario.fechaNacimiento) {
    errores.fechaDefuncion = "La fecha de defunción no puede ser anterior al nacimiento.";
  }

  if (formulario.region === "") errores.region = "Selecciona una región.";
  if (formulario.comuna === "") errores.comuna = "Selecciona una comuna.";
  if (formulario.estadoCivil === "") errores.estadoCivil = "Selecciona el estado civil.";

  LISTAS.forEach((lista) => {
    formulario[lista].forEach((fila, i) => {
      CAMPOS_LISTA[lista].claves.forEach((clave) => {
        const texto = (fila[clave] ?? "").trim();
        const ruta = `${lista}.${i}.${clave}`;
        if (texto === "") errores[ruta] = "Obligatorio.";
        else if (CAMPOS_LISTA[lista].numericos.includes(clave) && !/^\d+$/.test(texto)) {
          errores[ruta] = "Solo números enteros.";
        }
      });
    });
  });

  return errores;
}
