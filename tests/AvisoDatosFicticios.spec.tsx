import AvisoDatosFicticios from "@/components/AvisoDatosFicticios";
import { hacerClick, renderizar } from "./utils/renderizar";

describe("AvisoDatosFicticios (estado visible)", () => {
  it("se muestra al cargar la página", () => {
    const contenedor = renderizar(<AvisoDatosFicticios />);
    expect(contenedor.querySelector(".alert")).not.toBeNull();
    expect(contenedor.textContent).toContain("datos de este sitio son ficticios");
  });

  it("desaparece del DOM al apretar el botón cerrar", () => {
    const contenedor = renderizar(<AvisoDatosFicticios />);

    hacerClick(contenedor.querySelector(".btn-close"));

    expect(contenedor.querySelector(".alert")).toBeNull();
    expect(contenedor.innerHTML).toBe("");
  });

  it("puede recibir un mensaje personalizado por props", () => {
    const contenedor = renderizar(<AvisoDatosFicticios mensaje="Mensaje de prueba" />);
    expect(contenedor.textContent).toContain("Mensaje de prueba");
  });
});
