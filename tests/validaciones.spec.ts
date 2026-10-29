import {
  calcularDigitoVerificador,
  limpiarRut,
  validarRut,
  validarVerificacion,
} from "@/lib/validaciones";

describe("lib/validaciones", () => {
  describe("limpiarRut", () => {
    it("quita los puntos, los espacios y deja la K en mayúscula", () => {
      expect(limpiarRut(" 10.000.013-k ")).toBe("10000013-K");
    });
  });

  describe("calcularDigitoVerificador", () => {
    it("calcula el dígito con módulo 11", () => {
      expect(calcularDigitoVerificador("11111111")).toBe("1");
      expect(calcularDigitoVerificador("12345678")).toBe("5");
    });

    it("devuelve K cuando el resto es 10", () => {
      expect(calcularDigitoVerificador("10000013")).toBe("K");
    });

    it("devuelve 0 cuando el resto es 11", () => {
      expect(calcularDigitoVerificador("10000004")).toBe("0");
    });
  });

  describe("validarRut", () => {
    it("rechaza un RUT vacío", () => {
      const resultado = validarRut("   ");
      expect(resultado.valido).toBeFalse();
      expect(resultado.mensaje).toBe("Debes ingresar un RUT.");
    });

    it("rechaza un RUT sin guion o con letras", () => {
      expect(validarRut("111111111").valido).toBeFalse();
      expect(validarRut("abc-1").mensaje).toBe("El RUT debe tener el formato 12345678-9.");
    });

    it("rechaza un RUT con dígito verificador incorrecto", () => {
      const resultado = validarRut("11111111-2");
      expect(resultado.valido).toBeFalse();
      expect(resultado.mensaje).toBe("El dígito verificador no es correcto.");
    });

    it("acepta un RUT válido escrito con puntos y con K minúscula", () => {
      expect(validarRut("11.111.111-1")).toEqual({ valido: true, mensaje: "" });
      expect(validarRut("10000013-k").valido).toBeTrue();
    });
  });

  describe("validarVerificacion", () => {
    it("rechaza una respuesta vacía", () => {
      expect(validarVerificacion("", 64, 3).mensaje).toBe("Debes responder la operación.");
    });

    it("rechaza una respuesta que no es número", () => {
      expect(validarVerificacion("sesenta", 64, 3).mensaje).toBe("La respuesta debe ser un número.");
    });

    it("rechaza una suma incorrecta", () => {
      expect(validarVerificacion("66", 64, 3).valido).toBeFalse();
    });

    it("acepta la suma correcta aunque tenga espacios", () => {
      expect(validarVerificacion(" 67 ", 64, 3).valido).toBeTrue();
    });
  });
});
