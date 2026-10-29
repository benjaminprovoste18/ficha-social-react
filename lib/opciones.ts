// Listas fijas que usan los formularios y la vista de regiones.

export type Region = {
  nombre: string;
  slug: string;
  comunas: string[];
};

// Convierte un texto en algo que sirve para la URL: "La Araucanía" -> "la-araucania"
export function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const regiones: [string, string[]][] = [
  ["Arica y Parinacota", ["Arica", "Camarones", "Putre"]],
  ["Tarapacá", ["Iquique", "Alto Hospicio", "Pozo Almonte"]],
  ["Antofagasta", ["Antofagasta", "Calama", "Mejillones", "Tocopilla"]],
  ["Atacama", ["Copiapó", "Caldera", "Chañaral", "Vallenar"]],
  ["Coquimbo", ["La Serena", "Coquimbo", "Ovalle", "Illapel"]],
  ["Valparaíso", ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio", "Los Andes"]],
  ["Metropolitana", ["Santiago", "Cerrillos", "La Florida", "Maipú", "Providencia", "Puente Alto"]],
  ["O'Higgins", ["Rancagua", "Pichilemu", "Rengo", "San Fernando"]],
  ["Maule", ["Talca", "Cauquenes", "Curicó", "Linares"]],
  ["Ñuble", ["Chillán", "Bulnes", "San Carlos"]],
  ["Biobío", ["Concepción", "Coronel", "Los Ángeles", "Talcahuano"]],
  ["La Araucanía", ["Temuco", "Angol", "Pucón", "Villarrica"]],
  ["Los Ríos", ["Valdivia", "La Unión", "Panguipulli"]],
  ["Los Lagos", ["Puerto Montt", "Ancud", "Castro", "Osorno"]],
  ["Aysén", ["Coyhaique", "Chile Chico", "Puerto Aysén"]],
  ["Magallanes", ["Punta Arenas", "Porvenir", "Puerto Natales"]],
];

export const REGIONES: Region[] = regiones.map(([nombre, comunas]) => ({
  nombre,
  slug: aSlug(nombre),
  comunas,
}));

export function comunasDe(region: string): string[] {
  return REGIONES.find((r) => r.nombre === region)?.comunas ?? [];
}

export function regionPorSlug(slug: string): Region | undefined {
  return REGIONES.find((r) => r.slug === slug);
}

export const ESTADOS_CIVILES = ["Soltero", "Soltera", "Casado", "Casada", "Viudo", "Viuda", "Divorciado", "Divorciada"];

export const PARENTESCOS_FAMILIA = ["Cónyuge", "Hijo", "Hija", "Padre", "Madre", "Hermano", "Hermana", "Nieto", "Nieta", "Otro"];

// Quien puede pedir el cobro. "Otro (sin parentesco)" hace que la solicitud se rechace.
export const SIN_PARENTESCO = "Otro (sin parentesco)";
export const PARENTESCOS_SOLICITANTE = ["Cónyuge", "Hijo o hija", "Padre o madre", "Hermano o hermana", "Nieto o nieta", SIN_PARENTESCO];

export const TIPOS_BIEN = ["Inmueble", "Terreno", "Vehículo", "Cuenta de ahorro", "Otro"];
export const ESTADOS_DEUDA = ["pendiente", "pagada"];
export const ESTADOS_BENEFICIO = ["pendiente", "solicitado", "cobrado"];
export const ESTADOS_DOCUMENTO = ["emitido", "en trámite", "pendiente"];
