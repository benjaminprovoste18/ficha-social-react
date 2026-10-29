import BarraBusqueda from "@/components/BarraBusqueda";
import TablaFichas from "@/components/TablaFichas";
import TablaFichasFiltrable from "@/components/TablaFichasFiltrable";
import TablaBeneficiosPendientes from "@/components/TablaBeneficiosPendientes";
import { fichaAlDia, todasLasFichas } from "./datos";
import { escribir, hacerClick, renderizar } from "./utils/renderizar";

describe("BarraBusqueda (componente controlado)", () => {
  it("muestra los valores que recibe por props", () => {
    const contenedor = renderizar(
      <BarraBusqueda
        texto="rosa"
        soloPendientes={true}
        onTextoChange={() => {}}
        onSoloPendientesChange={() => {}}
      />
    );
    expect((contenedor.querySelector("#buscar") as HTMLInputElement).value).toBe("rosa");
    expect((contenedor.querySelector("#solo-pendientes") as HTMLInputElement).checked).toBeTrue();
  });

  it("avisa al padre cuando cambia el texto o el switch", () => {
    const alCambiarTexto = jasmine.createSpy("onTextoChange");
    const alCambiarFiltro = jasmine.createSpy("onSoloPendientesChange");
    const contenedor = renderizar(
      <BarraBusqueda
        texto=""
        soloPendientes={false}
        onTextoChange={alCambiarTexto}
        onSoloPendientesChange={alCambiarFiltro}
      />
    );

    escribir(contenedor.querySelector("#buscar"), "temuco");
    hacerClick(contenedor.querySelector("#solo-pendientes"));

    expect(alCambiarTexto).toHaveBeenCalledWith("temuco");
    expect(alCambiarFiltro).toHaveBeenCalledWith(true);
  });

  it("al apretar Enter no recarga la página (preventDefault)", () => {
    const contenedor = renderizar(
      <BarraBusqueda texto="" soloPendientes={false} onTextoChange={() => {}} onSoloPendientesChange={() => {}} />
    );
    const evento = new Event("submit", { bubbles: true, cancelable: true });

    contenedor.querySelector("form")!.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBeTrue();
  });
});

describe("TablaFichas", () => {
  it("muestra el mensaje cuando la lista viene vacía", () => {
    const contenedor = renderizar(<TablaFichas fichas={[]} mensajeVacio="Nada por aquí" />);
    expect(contenedor.querySelector("table")).toBeNull();
    expect(contenedor.textContent).toContain("Nada por aquí");
  });

  it("crea una fila por ficha con su estado y enlace al detalle", () => {
    const contenedor = renderizar(<TablaFichas fichas={todasLasFichas} />);
    const filas = contenedor.querySelectorAll("tbody tr");

    expect(filas.length).toBe(3);
    expect(filas[0].querySelector("a")!.getAttribute("href")).toBe("/fichas/11111111-1");
    expect(filas[0].querySelector(".badge")!.textContent).toBe("Con pendientes");
    expect(filas[1].querySelector(".badge")!.textContent).toBe("Al día");
  });
});

describe("TablaFichasFiltrable (estado del filtro)", () => {
  function contador(contenedor: HTMLElement) {
    return contenedor.querySelector("#contador-fichas")!.textContent;
  }

  it("al inicio muestra todas las fichas", () => {
    const contenedor = renderizar(<TablaFichasFiltrable fichas={todasLasFichas} />);
    expect(contador(contenedor)).toBe("Mostrando 3 de 3 fichas");
    expect(contenedor.querySelectorAll("tbody tr").length).toBe(3);
  });

  it("filtra la tabla al escribir en el buscador", () => {
    const contenedor = renderizar(<TablaFichasFiltrable fichas={todasLasFichas} />);

    escribir(contenedor.querySelector("#buscar"), "Temuco");

    expect(contador(contenedor)).toBe("Mostrando 1 de 3 fichas");
    expect(contenedor.querySelector("tbody")!.textContent).toContain("Jorge Manuel Riquelme Pardo");
  });

  it("el switch deja solo las fichas con trámites pendientes", () => {
    const contenedor = renderizar(<TablaFichasFiltrable fichas={todasLasFichas} />);

    hacerClick(contenedor.querySelector("#solo-pendientes"));

    expect(contador(contenedor)).toBe("Mostrando 2 de 3 fichas");
    expect(contenedor.querySelector("tbody")!.textContent).not.toContain("Riquelme");
  });

  it("muestra un mensaje si ninguna ficha coincide", () => {
    const contenedor = renderizar(<TablaFichasFiltrable fichas={todasLasFichas} />);

    escribir(contenedor.querySelector("#buscar"), "no existe");

    expect(contenedor.querySelector("table")).toBeNull();
    expect(contenedor.textContent).toContain("Ninguna ficha coincide con la búsqueda.");
  });
});

describe("TablaBeneficiosPendientes", () => {
  it("lista solo los beneficios pendientes y calcula el total", () => {
    const contenedor = renderizar(<TablaBeneficiosPendientes fichas={todasLasFichas} />);

    expect(contenedor.querySelectorAll("tbody tr").length).toBe(1);
    expect(contenedor.querySelector("tbody")!.textContent).toContain("Cuota mortuoria");
    expect(contenedor.querySelector("#total-beneficios")!.textContent).toBe("$650.000");
  });

  it("muestra un aviso cuando no hay beneficios pendientes", () => {
    const contenedor = renderizar(<TablaBeneficiosPendientes fichas={[fichaAlDia]} />);
    expect(contenedor.textContent).toContain("No hay beneficios pendientes de cobro.");
  });
});
