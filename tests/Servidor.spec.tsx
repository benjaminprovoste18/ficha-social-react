import { renderToString } from "react-dom/server";
import EnlaceSolicitud from "@/components/EnlaceSolicitud";
import TablaSolicitudes from "@/components/admin/TablaSolicitudes";
import VistaFichas from "@/components/vistas/VistaFichas";
import { agregarASeleccion, crearFicha, crearSolicitud } from "@/lib/baseDatos";
import { cuotaRosa, direccionValida, fichaAlDia, solicitanteValido } from "./datos";

// Cuando Next arma la pagina en el servidor no existe localStorage.
// renderToString simula ese momento: los hooks deben usar los datos iniciales.
describe("Render en el servidor (hooks con datos iniciales)", () => {
  it("la lista de fichas usa las 8 fichas iniciales aunque el navegador tenga más", () => {
    crearFicha({ ...fichaAlDia, id: "10000013-K" });
    const html = renderToString(<VistaFichas />);
    expect(html).toContain("Mostrando <!-- -->8<!-- --> de <!-- -->8<!-- --> fichas");
  });

  it("la solicitud y las solicitudes parten vacías", () => {
    agregarASeleccion(cuotaRosa);
    crearSolicitud({ solicitante: solicitanteValido, direccion: direccionValida, items: [cuotaRosa], fecha: "2026-10-28T12:00:00.000Z" });

    expect(renderToString(<EnlaceSolicitud />)).toContain(">0</span>");
    expect(renderToString(<TablaSolicitudes />)).toContain("Todavía no hay solicitudes.");
  });
});
