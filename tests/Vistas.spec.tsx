import DetalleFicha from "@/components/DetalleFicha";
import TarjetasRegiones from "@/components/TarjetasRegiones";
import TablaBeneficiosPendientes from "@/components/TablaBeneficiosPendientes";
import VistaBeneficios from "@/components/vistas/VistaBeneficios";
import VistaConDeudas from "@/components/vistas/VistaConDeudas";
import VistaFicha from "@/components/vistas/VistaFicha";
import VistaFichas from "@/components/vistas/VistaFichas";
import VistaRegion from "@/components/vistas/VistaRegion";
import VistaRegiones from "@/components/vistas/VistaRegiones";
import BarraNavegacion from "@/components/BarraNavegacion";
import { actualizarFicha, crearFicha, eliminarFicha, listarSeleccion, obtenerFicha } from "@/lib/baseDatos";
import { fichaAlDia, fichaConPendientes } from "./datos";
import { boton, enAct, hacerClick, renderizar } from "./utils/renderizar";

describe("Vistas públicas conectadas a la base de datos", () => {
  it("VistaFichas muestra las 8 fichas y se actualiza al crear una nueva", () => {
    const contenedor = renderizar(<VistaFichas />);
    expect(contenedor.querySelector("#contador-fichas")!.textContent).toBe("Mostrando 8 de 8 fichas");

    enAct(() => crearFicha({ ...fichaAlDia, id: "10000013-K" }));
    expect(contenedor.querySelector("#contador-fichas")!.textContent).toBe("Mostrando 9 de 9 fichas");
  });

  it("VistaConDeudas cuenta las fichas con deudas y su total", () => {
    const contenedor = renderizar(<VistaConDeudas />);
    expect(contenedor.querySelector("p")!.textContent).toBe("Hay 5 fichas con deudas pendientes, por un total de $23.010.000.");
  });

  it("VistaBeneficios lista los 4 beneficios pendientes", () => {
    const contenedor = renderizar(<VistaBeneficios />);
    expect(contenedor.querySelectorAll("tbody tr").length).toBe(4);
    expect(contenedor.querySelector("#total-beneficios")!.textContent).toBe("$19.980.000");
  });

  it("VistaFicha muestra la ficha, o el aviso si no existe", () => {
    const existe = renderizar(<VistaFicha rut="44444444-4" />);
    expect(existe.querySelector("article h2")!.textContent).toBe("Héctor Andrés Valenzuela Rojas");

    enAct(() => eliminarFicha("44444444-4"));
    expect(existe.textContent).toContain("No encontramos esa ficha");
  });

  it("VistaRegiones dibuja las 16 regiones con su cantidad", () => {
    const contenedor = renderizar(<VistaRegiones />);
    expect(contenedor.querySelectorAll(".card").length).toBe(16);
    expect(contenedor.querySelectorAll("a").length).toBe(8);
  });

  it("VistaRegion muestra las fichas de esa región, o un aviso si la región no existe", () => {
    const valparaiso = renderizar(<VistaRegion slug="valparaiso" />);
    expect(valparaiso.querySelector("h2")!.textContent).toBe("Región de Valparaíso");
    expect(valparaiso.textContent).toContain("1 ficha registrada.");

    const maule = renderizar(<VistaRegion slug="maule" />);
    expect(maule.textContent).toContain("0 fichas registradas.");
    expect(maule.textContent).toContain("Todavía no hay fichas registradas en esta región.");

    const nada = renderizar(<VistaRegion slug="marte" />);
    expect(nada.textContent).toContain("Esa región no existe.");
  });
});

describe("TarjetasRegiones (props)", () => {
  it("solo pone enlace en las regiones que tienen fichas", () => {
    const contenedor = renderizar(
      <TarjetasRegiones
        resumen={[
          { region: "Maule", slug: "maule", cantidad: 0, deudas: 0, beneficios: 0 },
          { region: "Ñuble", slug: "nuble", cantidad: 1, deudas: 0, beneficios: 0 },
        ]}
      />
    );
    const tarjetas = contenedor.querySelectorAll(".card");
    expect(tarjetas[0].classList).toContain("opacity-50");
    expect(tarjetas[0].textContent).toContain("fichas");
    expect(tarjetas[1].querySelector("a")!.getAttribute("href")).toBe("/regiones/nuble");
    expect(tarjetas[1].textContent).toContain("1ficha");
  });
});

describe("Beneficios en el detalle y en la tabla", () => {
  it("DetalleFicha permite agregar un beneficio pendiente a la solicitud", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaConPendientes} />);
    hacerClick(boton(contenedor, "Agregar a solicitud"));
    expect(listarSeleccion().map((i) => i.beneficio)).toEqual(["Cuota mortuoria"]);
  });

  it("DetalleFicha en modo admin no muestra el botón y vuelve al panel", () => {
    const contenedor = renderizar(<DetalleFicha ficha={fichaConPendientes} volverA="/admin/fichas" permitirSolicitud={false} />);
    expect(contenedor.textContent).not.toContain("Agregar a solicitud");
    expect(contenedor.querySelector('a[href="/admin/fichas"]')).not.toBeNull();
  });

  it("TablaBeneficiosPendientes muestra Solicitado en vez del botón cuando ya se pidió", () => {
    enAct(() => {
      const rosa = obtenerFicha("11111111-1")!;
      actualizarFicha("11111111-1", { ...rosa, beneficios: [{ nombre: "Cuota mortuoria", monto: 650000, estado: "solicitado" }] });
    });
    const contenedor = renderizar(<TablaBeneficiosPendientes fichas={[obtenerFicha("11111111-1")!]} />);
    expect(contenedor.querySelector("tbody .badge")!.textContent).toBe("Solicitado");
    expect(contenedor.querySelector("tbody button")).toBeNull();
  });
});

describe("BarraNavegacion con contenido extra", () => {
  it("dibuja lo que recibe en la prop extra", () => {
    const contenedor = renderizar(<BarraNavegacion titulo="Ficha" enlaces={[]} extra={<span id="extra">Hola</span>} />);
    expect(contenedor.querySelector("#extra")!.textContent).toBe("Hola");
  });
});
