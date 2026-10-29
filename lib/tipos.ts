// Tipos que usamos en toda la app.
// Todos los datos son ficticios, solo para fines académicos.

export type Familiar = {
  nombre: string;
  parentesco: string;
};

export type Bien = {
  tipo: string;
  descripcion: string;
  avaluo: number;
};

export type EstadoDeuda = "pendiente" | "pagada";

export type Deuda = {
  institucion: string;
  monto: number;
  estado: EstadoDeuda;
};

// "solicitado" = alguien de la familia ya ingreso una solicitud de cobro
export type EstadoBeneficio = "pendiente" | "solicitado" | "cobrado";

export type Beneficio = {
  nombre: string;
  monto: number;
  estado: EstadoBeneficio;
};

export type EstadoDocumento = "emitido" | "en trámite" | "pendiente";

export type Documento = {
  nombre: string;
  estado: EstadoDocumento;
};

export type Ficha = {
  id: string; // el id es el RUT
  nombre: string;
  fechaNacimiento: string;
  fechaDefuncion: string;
  comuna: string;
  region: string;
  estadoCivil: string;
  familia: Familiar[];
  bienes: Bien[];
  deudas: Deuda[];
  beneficios: Beneficio[];
  documentos: Documento[];
};

// Un beneficio que el usuario agrego a su solicitud (como un producto en el carrito)
export type ItemSolicitud = {
  rut: string;
  nombreFallecido: string;
  beneficio: string;
  monto: number;
};

export type Solicitante = {
  nombres: string;
  apellidos: string;
  rut: string;
  correo: string;
  parentesco: string;
};

export type Direccion = {
  calle: string;
  depto: string;
  region: string;
  comuna: string;
  indicaciones: string;
};

export type EstadoSolicitud = "ingresada" | "aprobada" | "rechazada";

// Como una orden de compra o boleta, pero de una solicitud de cobro
export type Solicitud = {
  id: string;
  fecha: string;
  solicitante: Solicitante;
  direccion: Direccion;
  items: ItemSolicitud[];
  total: number;
  estado: EstadoSolicitud;
  motivo: string;
};

export type ResultadoValidacion = {
  valido: boolean;
  mensaje: string;
};

// Errores de un formulario: nombre del campo -> mensaje
export type Errores = Record<string, string>;
