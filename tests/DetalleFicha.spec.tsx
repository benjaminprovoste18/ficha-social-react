import DetalleFicha from "@/components/DetalleFicha";
import SeccionFicha from "@/components/SeccionFicha";
import { fichaConPendientes, fichaSinBienes } from "./datos";
import { hacerClick, renderizar } from "./utils/renderizar";

describe("DetalleFicha", () => {
  it("muestra los datos personales de la ficha", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaConPendientes} />);

    expect(contenedor.querySelector("h2")!.textContent).toBe("Rosa Elena Fuentes Araya");
    expect(contenedor.textContent).toContain("RUT 11111111-1");
    expect(contenedor.textContent).toContain("02-07-2024");
    expect(contenedor.querySelector("#edad")!.textContent).toBe("83 años");
  });

  it("calcula el resumen de bienes, deudas y beneficios", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaConPendientes} />);
    const montos = Array.from(contenedor.querySelectorAll(".fs-4")).map((m) => m.textContent);

    expect(montos).toEqual(["$48.500.000", "$320.000", "$650.000"]);
  });

  it("muestra cada familiar y los estados de deudas y documentos", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaConPendientes} />);

    expect(contenedor.textContent).toContain("Carmen Gloria Soto Fuentes");
    expect(contenedor.textContent).toContain("Hija");
    const estados = Array.from(contenedor.querySelectorAll(".badge.text-bg-warning")).map((b) => b.textContent);
    expect(estados).toContain("En trámite");
  });

  it("muestra 'Sin registros.' en las secciones vacías", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaSinBienes} />);
    const vacias = Array.from(contenedor.querySelectorAll("p")).filter(
      (p) => p.textContent === "Sin registros."
    );
    // familia, bienes, beneficios y documentos estan vacios
    expect(vacias.length).toBe(4);
  });
});

describe("SeccionFicha (estado abierta/cerrada)", () => {
  it("parte abierta y se puede ocultar y volver a mostrar", () => {
    const contenedor = renderizar(
      <SeccionFicha titulo="Bienes" cantidad={1}>
        <p id="contenido">Casa</p>
      </SeccionFicha>
    );
    const boton = contenedor.querySelector("button")!;

    expect(contenedor.querySelector("#contenido")).not.toBeNull();

    hacerClick(boton);
    expect(contenedor.querySelector("#contenido")).toBeNull();
    expect(boton.textContent).toBe("Mostrar");
    expect(boton.getAttribute("aria-expanded")).toBe("false");

    hacerClick(boton);
    expect(contenedor.querySelector("#contenido")).not.toBeNull();
  });

  it("muestra la cantidad que recibe por props", () => {
    const contenedor = renderizar(
      <SeccionFicha titulo="Deudas" cantidad={5}>
        <p>x</p>
      </SeccionFicha>
    );
    expect(contenedor.querySelector("h3 .badge")!.textContent).toBe("5");
  });
});
