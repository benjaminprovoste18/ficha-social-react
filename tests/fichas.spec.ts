import {
  calcularEdad,
  fechaLocalHoy,
  formatearFechaHora,
  resumenPorRegion,
  filtrarFichas,
  formatearFecha,
  formatearPesos,
  tienePendientes,
  totalBeneficiosPendientes,
  totalBienes,
  totalDeudasPendientes,
} from "@/lib/fichas";
import { fichaAlDia, fichaConPendientes, fichaSinBienes, todasLasFichas } from "./datos";

describe("lib/fichas", () => {
  describe("totales", () => {
    it("suma solo las deudas pendientes (ignora las pagadas)", () => {
      expect(totalDeudasPendientes(fichaConPendientes)).toBe(320000);
      expect(totalDeudasPendientes(fichaAlDia)).toBe(0);
    });

    it("suma el avalúo de todos los bienes", () => {
      expect(totalBienes(fichaAlDia)).toBe(8500000);
      expect(totalBienes(fichaSinBienes)).toBe(0);
    });

    it("suma solo los beneficios pendientes", () => {
      expect(totalBeneficiosPendientes(fichaConPendientes)).toBe(650000);
      expect(totalBeneficiosPendientes(fichaAlDia)).toBe(0);
    });
  });

  describe("tienePendientes", () => {
    it("es true si hay deudas o beneficios pendientes", () => {
      expect(tienePendientes(fichaConPendientes)).toBeTrue();
      expect(tienePendientes(fichaSinBienes)).toBeTrue();
    });

    it("es false si todo está pagado y cobrado", () => {
      expect(tienePendientes(fichaAlDia)).toBeFalse();
    });
  });

  describe("filtrarFichas", () => {
    it("devuelve todas si no hay texto ni filtro", () => {
      expect(filtrarFichas(todasLasFichas, "", false).length).toBe(3);
    });

    it("busca por nombre sin importar tildes ni mayúsculas", () => {
      const resultado = filtrarFichas(todasLasFichas, "RIQUELME", false);
      expect(resultado.map((f) => f.id)).toEqual(["22222222-2"]);
      expect(filtrarFichas(todasLasFichas, "valparaiso", false).length).toBe(1);
    });

    it("busca por RUT aunque se escriba con puntos", () => {
      const resultado = filtrarFichas(todasLasFichas, "33.333.333", false);
      expect(resultado[0].nombre).toBe("Marta Isabel Contreras Leiva");
    });

    it("con soloPendientes deja fuera las fichas al día", () => {
      const resultado = filtrarFichas(todasLasFichas, "", true);
      expect(resultado.map((f) => f.id)).toEqual(["11111111-1", "33333333-3"]);
    });
  });

  describe("formatos", () => {
    it("formatea pesos chilenos con punto de miles", () => {
      expect(formatearPesos(18400000)).toBe("$18.400.000");
    });

    it("cambia la fecha de AAAA-MM-DD a DD-MM-AAAA", () => {
      expect(formatearFecha("2024-07-02")).toBe("02-07-2024");
    });

    it("calcula la edad al fallecer considerando si ya fue el cumpleaños", () => {
      expect(calcularEdad("1941-03-12", "2024-07-02")).toBe(83);
      expect(calcularEdad("1950-11-28", "2023-11-27")).toBe(72);
      expect(calcularEdad("1950-11-28", "2023-11-28")).toBe(73);
    });
  });

  describe("estado solicitado", () => {
    it("un beneficio solicitado sigue contando como pendiente", () => {
      const ficha = { ...fichaAlDia, beneficios: [{ nombre: "Cuota mortuoria", monto: 650000, estado: "solicitado" as const }] };
      expect(tienePendientes(ficha)).toBeTrue();
      expect(totalBeneficiosPendientes(ficha)).toBe(650000);
    });
  });

  describe("fechas y reportes", () => {
    it("formatea fecha y hora en hora local", () => {
      const fecha = new Date(2026, 9, 28, 21, 5).toISOString();
      expect(formatearFechaHora(fecha)).toBe("28-10-2026 21:05");
    });

    it("fechaLocalHoy devuelve AAAA-MM-DD", () => {
      expect(fechaLocalHoy(new Date(2026, 0, 5))).toBe("2026-01-05");
      expect(fechaLocalHoy()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("resumenPorRegion suma por región y deja en 0 las regiones sin fichas", () => {
      const resumen = resumenPorRegion(todasLasFichas);
      const valparaiso = resumen.find((r) => r.region === "Valparaíso")!;

      expect(resumen.length).toBe(16);
      expect(valparaiso).toEqual({ region: "Valparaíso", slug: "valparaiso", cantidad: 1, deudas: 320000, beneficios: 650000 });
      expect(resumen.find((r) => r.region === "Maule")!.cantidad).toBe(0);
    });
  });
});
