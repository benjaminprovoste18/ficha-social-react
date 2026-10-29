import type { EstadoSolicitud, Ficha, ItemSolicitud, Solicitante, Direccion, Solicitud } from "./tipos";
import { fichasIniciales } from "./datosIniciales";
import { motivoRechazo } from "./validaciones";

// "Base de datos" simulada del sistema.
// Guarda tres colecciones en el localStorage del navegador:
//   fichas       -> las fichas sociales (CRUD completo desde el panel de administracion)
//   solicitudes  -> las solicitudes de cobro ya enviadas (como ordenes de compra)
//   seleccion    -> los beneficios que el usuario va agregando a su solicitud (como un carrito)
// Cada vez que algo cambia se avisa a los componentes suscritos, asi la interfaz
// se actualiza al tiro (ver lib/hooks.ts).

export const CLAVES = {
  fichas: "fichaSocial.fichas",
  solicitudes: "fichaSocial.solicitudes",
  seleccion: "fichaSocial.seleccion",
} as const;

type Colecciones = {
  fichas: Ficha[];
  solicitudes: Solicitud[];
  seleccion: ItemSolicitud[];
};
type Coleccion = keyof Colecciones;

const iniciales: { [K in Coleccion]: () => Colecciones[K] } = {
  fichas: () => copiar(fichasIniciales),
  solicitudes: () => [],
  seleccion: () => [],
};

// Lo ultimo que se leyo de cada coleccion. Sirve para devolver siempre
// el mismo arreglo mientras no haya cambios (React lo necesita asi).
const cache: Partial<Colecciones> = {};
const oyentes = new Set<() => void>();

function copiar<T>(valor: T): T {
  return JSON.parse(JSON.stringify(valor));
}

function leer<K extends Coleccion>(coleccion: K): Colecciones[K] {
  const guardado = cache[coleccion];
  if (guardado) return guardado;
  // en el servidor no existe localStorage
  if (typeof window === "undefined") return iniciales[coleccion]();

  let valor: Colecciones[K];
  try {
    const texto = window.localStorage.getItem(CLAVES[coleccion]);
    valor = texto ? JSON.parse(texto) : iniciales[coleccion]();
  } catch {
    // localStorage bloqueado o con datos malos: partimos con los datos iniciales
    valor = iniciales[coleccion]();
  }
  cache[coleccion] = valor;
  return valor;
}

function guardar<K extends Coleccion>(coleccion: K, valor: Colecciones[K]) {
  cache[coleccion] = valor;
  try {
    window.localStorage.setItem(CLAVES[coleccion], JSON.stringify(valor));
  } catch {
    // si no se puede guardar, al menos queda en memoria mientras la pagina este abierta
  }
  avisarCambios();
}

function avisarCambios() {
  oyentes.forEach((oyente) => oyente());
}

// Si otra pestaña cambia el localStorage, recargamos esa coleccion
function alCambiarOtraPestana(evento: StorageEvent) {
  const coleccion = (Object.keys(CLAVES) as Coleccion[]).find((c) => CLAVES[c] === evento.key);
  if (coleccion || evento.key === null) {
    if (coleccion) delete cache[coleccion];
    else (Object.keys(CLAVES) as Coleccion[]).forEach((c) => delete cache[c]);
    avisarCambios();
  }
}

export function suscribir(oyente: () => void): () => void {
  if (oyentes.size === 0) window.addEventListener("storage", alCambiarOtraPestana);
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
    if (oyentes.size === 0) window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

// Borra todo y vuelve a los datos iniciales
export function restablecerDatos() {
  (Object.keys(CLAVES) as Coleccion[]).forEach((coleccion) => {
    delete cache[coleccion];
    try {
      window.localStorage.removeItem(CLAVES[coleccion]);
    } catch {
      // nada que hacer
    }
  });
  avisarCambios();
}

// ---------------------------------------------------------------- FICHAS (CRUD)

export function listarFichas(): Ficha[] {
  return leer("fichas");
}

export function obtenerFicha(rut: string): Ficha | undefined {
  return listarFichas().find((ficha) => ficha.id === rut);
}

export function crearFicha(ficha: Ficha): Ficha {
  if (obtenerFicha(ficha.id)) {
    throw new Error("Ya existe una ficha con el RUT " + ficha.id);
  }
  const nueva = copiar(ficha);
  guardar("fichas", [...listarFichas(), nueva]);
  return nueva;
}

export function actualizarFicha(rut: string, datos: Ficha): Ficha {
  if (!obtenerFicha(rut)) {
    throw new Error("No existe una ficha con el RUT " + rut);
  }
  const actualizada = { ...copiar(datos), id: rut };
  guardar("fichas", listarFichas().map((ficha) => (ficha.id === rut ? actualizada : ficha)));
  return actualizada;
}

export function eliminarFicha(rut: string): boolean {
  if (!obtenerFicha(rut)) return false;
  guardar("fichas", listarFichas().filter((ficha) => ficha.id !== rut));
  // si estaba en la solicitud que se esta armando, tambien se saca
  const seleccion = listarSeleccion();
  if (seleccion.some((item) => item.rut === rut)) {
    guardar("seleccion", seleccion.filter((item) => item.rut !== rut));
  }
  return true;
}

// Cambia el estado de los beneficios de una lista de items (ej: pendiente -> solicitado)
function cambiarEstadoBeneficios(items: ItemSolicitud[], desde: string[], hacia: Ficha["beneficios"][number]["estado"]) {
  const fichas = listarFichas().map((ficha) => {
    const delaFicha = items.filter((item) => item.rut === ficha.id).map((item) => item.beneficio);
    if (delaFicha.length === 0) return ficha;
    return {
      ...ficha,
      beneficios: ficha.beneficios.map((b) =>
        delaFicha.includes(b.nombre) && desde.includes(b.estado) ? { ...b, estado: hacia } : b
      ),
    };
  });
  guardar("fichas", fichas);
}

// ---------------------------------------------------------------- SELECCION (carrito)

export function listarSeleccion(): ItemSolicitud[] {
  return leer("seleccion");
}

export function estaSeleccionado(rut: string, beneficio: string): boolean {
  return listarSeleccion().some((item) => item.rut === rut && item.beneficio === beneficio);
}

export function agregarASeleccion(item: ItemSolicitud): boolean {
  if (estaSeleccionado(item.rut, item.beneficio)) return false;
  guardar("seleccion", [...listarSeleccion(), { ...item }]);
  return true;
}

export function quitarDeSeleccion(rut: string, beneficio: string) {
  guardar("seleccion", listarSeleccion().filter((item) => !(item.rut === rut && item.beneficio === beneficio)));
}

export function vaciarSeleccion() {
  guardar("seleccion", []);
}

// ---------------------------------------------------------------- SOLICITUDES

export function listarSolicitudes(): Solicitud[] {
  return leer("solicitudes");
}

export function obtenerSolicitud(id: string): Solicitud | undefined {
  return listarSolicitudes().find((solicitud) => solicitud.id === id);
}

function siguienteId(): string {
  const numeros = listarSolicitudes().map((s) => Number(s.id.replace("SOL-", "")) || 0);
  const siguiente = Math.max(0, ...numeros) + 1;
  return "SOL-" + String(siguiente).padStart(4, "0");
}

type DatosSolicitud = {
  solicitante: Solicitante;
  direccion: Direccion;
  items: ItemSolicitud[];
  fecha: string;
};

// Guarda la solicitud. Si el solicitante no tiene parentesco queda rechazada;
// si no, queda ingresada, los beneficios pasan a "solicitado" y se vacia la seleccion.
export function crearSolicitud(datos: DatosSolicitud): Solicitud {
  if (datos.items.length === 0) {
    throw new Error("La solicitud no tiene beneficios");
  }
  const motivo = motivoRechazo(datos.solicitante);
  const solicitud: Solicitud = {
    id: siguienteId(),
    fecha: datos.fecha,
    solicitante: { ...datos.solicitante },
    direccion: { ...datos.direccion },
    items: copiar(datos.items),
    total: datos.items.reduce((suma, item) => suma + item.monto, 0),
    estado: motivo ? "rechazada" : "ingresada",
    motivo,
  };
  guardar("solicitudes", [...listarSolicitudes(), solicitud]);

  if (solicitud.estado === "ingresada") {
    cambiarEstadoBeneficios(solicitud.items, ["pendiente"], "solicitado");
    vaciarSeleccion();
  }
  return solicitud;
}

// El administrador aprueba (beneficios -> cobrado) o rechaza (beneficios -> pendiente)
export function cambiarEstadoSolicitud(id: string, estado: Exclude<EstadoSolicitud, "ingresada">, motivo = ""): Solicitud {
  const solicitud = obtenerSolicitud(id);
  if (!solicitud) throw new Error("No existe la solicitud " + id);
  if (solicitud.estado !== "ingresada") throw new Error("La solicitud " + id + " ya fue revisada");

  const actualizada: Solicitud = { ...solicitud, estado, motivo };
  guardar("solicitudes", listarSolicitudes().map((s) => (s.id === id ? actualizada : s)));
  cambiarEstadoBeneficios(solicitud.items, ["solicitado"], estado === "aprobada" ? "cobrado" : "pendiente");
  return actualizada;
}

export function eliminarSolicitud(id: string): boolean {
  const solicitud = obtenerSolicitud(id);
  if (!solicitud) return false;
  guardar("solicitudes", listarSolicitudes().filter((s) => s.id !== id));
  // si estaba en revision, los beneficios vuelven a quedar pendientes
  if (solicitud.estado === "ingresada") {
    cambiarEstadoBeneficios(solicitud.items, ["solicitado"], "pendiente");
  }
  return true;
}
