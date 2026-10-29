import type { Direccion, Ficha, ItemSolicitud, Solicitante } from "@/lib/tipos";

// Datos de prueba (fixtures) para las pruebas unitarias.
// Son independientes de lib/datosIniciales.ts, asi un cambio en esos datos no rompe las pruebas.

export const fichaConPendientes: Ficha = {
  id: "11111111-1",
  nombre: "Rosa Elena Fuentes Araya",
  fechaNacimiento: "1941-03-12",
  fechaDefuncion: "2024-07-02",
  comuna: "Valparaíso",
  region: "Valparaíso",
  estadoCivil: "Viuda",
  familia: [
    { nombre: "Carmen Gloria Soto Fuentes", parentesco: "Hija" },
    { nombre: "Luis Alberto Soto Fuentes", parentesco: "Hijo" },
  ],
  bienes: [{ tipo: "Inmueble", descripcion: "Casa habitación", avaluo: 48500000 }],
  deudas: [
    { institucion: "Tienda Comercial Ficticia", monto: 320000, estado: "pendiente" },
    { institucion: "Farmacia Ficticia", monto: 85000, estado: "pagada" },
  ],
  beneficios: [
    { nombre: "Cuota mortuoria", monto: 650000, estado: "pendiente" },
    { nombre: "Pensión de sobrevivencia", monto: 210000, estado: "cobrado" },
  ],
  documentos: [
    { nombre: "Certificado de defunción", estado: "emitido" },
    { nombre: "Posesión efectiva", estado: "en trámite" },
  ],
};

export const fichaAlDia: Ficha = {
  id: "22222222-2",
  nombre: "Jorge Manuel Riquelme Pardo",
  fechaNacimiento: "1950-11-28",
  fechaDefuncion: "2023-12-15",
  comuna: "Temuco",
  region: "La Araucanía",
  estadoCivil: "Casado",
  familia: [{ nombre: "Ana María Toro Vidal", parentesco: "Cónyuge" }],
  bienes: [
    { tipo: "Vehículo", descripcion: "Camioneta año 2012", avaluo: 6200000 },
    { tipo: "Cuenta de ahorro", descripcion: "Banco Ficticio del Sur", avaluo: 2300000 },
  ],
  deudas: [],
  beneficios: [{ nombre: "Cuota mortuoria", monto: 650000, estado: "cobrado" }],
  documentos: [{ nombre: "Certificado de defunción", estado: "emitido" }],
};

export const fichaSinBienes: Ficha = {
  id: "33333333-3",
  nombre: "Marta Isabel Contreras Leiva",
  fechaNacimiento: "1938-06-04",
  fechaDefuncion: "2025-02-20",
  comuna: "Santiago",
  region: "Metropolitana",
  estadoCivil: "Soltera",
  familia: [],
  bienes: [],
  deudas: [{ institucion: "Banco Ficticio Central", monto: 1250000, estado: "pendiente" }],
  beneficios: [],
  documentos: [],
};

export const todasLasFichas: Ficha[] = [fichaConPendientes, fichaAlDia, fichaSinBienes];

export const solicitanteValido: Solicitante = {
  nombres: "Carmen Gloria",
  apellidos: "Soto Fuentes",
  rut: "22222222-2",
  correo: "carmen@correo.cl",
  parentesco: "Hijo o hija",
};

export const direccionValida: Direccion = {
  calle: "Av. Ficticia 123",
  depto: "",
  region: "Valparaíso",
  comuna: "Viña del Mar",
  indicaciones: "",
};

// Beneficios pendientes que vienen en los datos iniciales (lib/datosIniciales.ts)
export const cuotaRosa: ItemSolicitud = {
  rut: "11111111-1",
  nombreFallecido: "Rosa Elena Fuentes Araya",
  beneficio: "Cuota mortuoria",
  monto: 650000,
};

export const pensionRaul: ItemSolicitud = {
  rut: "66666666-6",
  nombreFallecido: "Raúl Esteban Mardones Silva",
  beneficio: "Pensión de sobrevivencia",
  monto: 280000,
};
