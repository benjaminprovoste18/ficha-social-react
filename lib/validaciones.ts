import type { Direccion, Errores, ResultadoValidacion, Solicitante } from "./tipos";
import { SIN_PARENTESCO } from "./opciones";

// Saca puntos y espacios, y deja la K en mayuscula.
// Ej: "11.111.111-k" -> "11111111-K"
export function limpiarRut(rut: string): string {
  return rut.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
}

// Calcula el digito verificador con el algoritmo modulo 11.
export function calcularDigitoVerificador(numero: string): string {
  let suma = 0;
  let multiplicador = 2;

  for (let i = numero.length - 1; i >= 0; i--) {
    suma += Number(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

// Valida que el RUT no venga vacio, que tenga formato 12345678-9
// y que el digito verificador sea correcto.
export function validarRut(rut: string): ResultadoValidacion {
  const limpio = limpiarRut(rut);

  if (limpio === "") {
    return { valido: false, mensaje: "Debes ingresar un RUT." };
  }

  if (!/^\d{7,8}-[\dK]$/.test(limpio)) {
    return {
      valido: false,
      mensaje: "El RUT debe tener el formato 12345678-9.",
    };
  }

  const [numero, dv] = limpio.split("-");
  if (calcularDigitoVerificador(numero) !== dv) {
    return { valido: false, mensaje: "El dígito verificador no es correcto." };
  }

  return { valido: true, mensaje: "" };
}

// Revisa la respuesta de la operacion de verificacion (ej: 64 + 3).
export function validarVerificacion(
  respuesta: string,
  numeroA: number,
  numeroB: number
): ResultadoValidacion {
  const texto = respuesta.trim();

  if (texto === "") {
    return { valido: false, mensaje: "Debes responder la operación." };
  }

  if (!/^-?\d+$/.test(texto)) {
    return { valido: false, mensaje: "La respuesta debe ser un número." };
  }

  if (Number(texto) !== numeroA + numeroB) {
    return { valido: false, mensaje: "La respuesta de verificación es incorrecta." };
  }

  return { valido: true, mensaje: "" };
}

export function validarCorreo(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

// Regla del negocio: solo la familia puede pedir el cobro de un beneficio.
// Devuelve el motivo del rechazo, o "" si la solicitud se puede ingresar.
export function motivoRechazo(solicitante: Solicitante): string {
  if (solicitante.parentesco === SIN_PARENTESCO) {
    return "Solo el cónyuge o un familiar directo puede solicitar el cobro de beneficios.";
  }
  return "";
}

// Valida el formulario de la solicitud (como el checkout de una tienda).
// Devuelve un objeto con los errores; si viene vacio, esta todo bien.
export function validarSolicitud(
  solicitante: Solicitante,
  direccion: Direccion,
  cantidadBeneficios: number
): Errores {
  const errores: Errores = {};

  if (cantidadBeneficios === 0) errores.beneficios = "Agrega al menos un beneficio a la solicitud.";
  if (solicitante.nombres.trim() === "") errores.nombres = "Ingresa tus nombres.";
  if (solicitante.apellidos.trim() === "") errores.apellidos = "Ingresa tus apellidos.";

  const rut = validarRut(solicitante.rut);
  if (!rut.valido) errores.rut = rut.mensaje;

  if (solicitante.correo.trim() === "") errores.correo = "Ingresa tu correo.";
  else if (!validarCorreo(solicitante.correo)) errores.correo = "El correo no tiene un formato válido.";

  if (solicitante.parentesco === "") errores.parentesco = "Selecciona tu parentesco.";
  if (direccion.calle.trim() === "") errores.calle = "Ingresa la calle y el número.";
  if (direccion.region === "") errores.region = "Selecciona una región.";
  if (direccion.comuna === "") errores.comuna = "Selecciona una comuna.";

  return errores;
}
