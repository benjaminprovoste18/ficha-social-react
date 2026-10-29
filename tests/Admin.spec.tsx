import DetalleSolicitudAdmin from "@/components/admin/DetalleSolicitudAdmin";
import FormularioFicha from "@/components/admin/FormularioFicha";
import ListaEditable from "@/components/admin/ListaEditable";
import MenuAdmin from "@/components/admin/MenuAdmin";
import PanelAdmin from "@/components/admin/PanelAdmin";
import ReportesAdmin from "@/components/admin/ReportesAdmin";
import TablaAdminFichas from "@/components/admin/TablaAdminFichas";
import TablaSolicitudes from "@/components/admin/TablaSolicitudes";
import TarjetaEstadistica from "@/components/admin/TarjetaEstadistica";
import VistaAdminFicha from "@/components/admin/VistaAdminFicha";
import { cambiarEstadoSolicitud, crearFicha, crearSolicitud, listarFichas, obtenerFicha, obtenerSolicitud } from "@/lib/baseDatos";
import { SIN_PARENTESCO } from "@/lib/opciones";
import type { FilaEditable } from "@/lib/fichaFormulario";
import { cuotaRosa, direccionValida, fichaAlDia, pensionRaul, solicitanteValido } from "./datos";
import { navegacionFalsa, routerFalso } from "./mocks/next-navigation";
import { boton, elegir, enAct, escribir, hacerClick, renderizar } from "./utils/renderizar";

const FECHA = new Date(2026, 9, 28, 21, 5).toISOString();

function nuevaSolicitud(parentesco = "Cónyuge", items = [cuotaRosa]) {
  enAct(() => {
    crearSolicitud({ solicitante: { ...solicitanteValido, parentesco }, direccion: direccionValida, items, fecha: FECHA });
  });
}

describe("MenuAdmin", () => {
  const enlaces = [
    { href: "/admin", texto: "Dashboard" },
    { href: "/admin/fichas", texto: "Fichas" },
  ];

  it("marca Fichas como activo también en sus subpáginas, y Dashboard solo en /admin", () => {
    navegacionFalsa.rutaActual = "/admin/fichas/11111111-1";
    const contenedor = renderizar(<MenuAdmin enlaces={enlaces} />);
    const activos = Array.from(contenedor.querySelectorAll(".nav-link.active")).map((a) => a.textContent);
    expect(activos).toEqual(["Fichas"]);
  });

  it("en celular el botón Menú muestra y oculta el menú", () => {
    navegacionFalsa.rutaActual = "/admin";
    const contenedor = renderizar(<MenuAdmin enlaces={enlaces} />);
    const menu = contenedor.querySelector("#menu-admin")!;

    expect(menu.classList).toContain("d-none");
    hacerClick(boton(contenedor, "Menú"));
    expect(menu.classList).not.toContain("d-none");
    hacerClick(contenedor.querySelector(".nav-link"));
    expect(menu.classList).toContain("d-none");
  });
});

describe("TarjetaEstadistica y PanelAdmin", () => {
  it("la tarjeta usa el color y el detalle que recibe", () => {
    const contenedor = renderizar(<TarjetaEstadistica titulo="Fichas" valor={8} detalle="5 pendientes" color="warning" />);
    expect(contenedor.querySelector(".card")!.classList).toContain("text-bg-warning");
    expect(contenedor.textContent).toBe("Fichas85 pendientes");
  });

  it("el dashboard calcula los números con los datos iniciales", () => {
    const contenedor = renderizar(<PanelAdmin />);
    const texto = contenedor.querySelector("#estadisticas")!.textContent;

    expect(texto).toContain("Fichas85 con trámites pendientes");
    expect(texto).toContain("Solicitudes00 en revisión");
    expect(texto).toContain("$19.980.000");
    expect(texto).toContain("$23.010.000");
  });

  it("se actualiza solo cuando llega una solicitud, y Restablecer borra los cambios", () => {
    const contenedor = renderizar(<PanelAdmin />);
    nuevaSolicitud();
    expect(contenedor.textContent).toContain("1 en revisión");

    hacerClick(boton(contenedor, "Restablecer datos"));
    hacerClick(boton(contenedor, "Sí"));
    expect(contenedor.textContent).toContain("0 en revisión");
  });
});

describe("TablaAdminFichas (CRUD: listar y eliminar)", () => {
  it("lista las fichas y filtra con el buscador", () => {
    const contenedor = renderizar(<TablaAdminFichas />);
    expect(contenedor.querySelectorAll("tbody tr").length).toBe(8);

    escribir(contenedor.querySelector("#buscar"), "temuco");
    expect(contenedor.querySelector("#contador-admin")!.textContent).toBe("1 de 8 fichas");

    escribir(contenedor.querySelector("#buscar"), "nadie");
    expect(contenedor.textContent).toContain("No hay fichas para mostrar.");
  });

  it("eliminar pide confirmación, borra la ficha y muestra un mensaje que se puede cerrar", () => {
    const contenedor = renderizar(<TablaAdminFichas />);
    const fila = contenedor.querySelector("tbody tr")!;

    hacerClick(boton(fila, "Eliminar"));
    hacerClick(boton(fila, "Sí"));

    expect(obtenerFicha("11111111-1")).toBeUndefined();
    expect(contenedor.querySelectorAll("tbody tr").length).toBe(7);
    expect(contenedor.querySelector("#mensaje-admin")!.textContent).toContain("Rosa Elena Fuentes Araya");

    hacerClick(contenedor.querySelector("#mensaje-admin .btn-close"));
    expect(contenedor.querySelector("#mensaje-admin")).toBeNull();
  });
});

describe("ListaEditable (formulario dinámico)", () => {
  const campos = [
    { clave: "nombre", etiqueta: "Nombre", columnas: "col-6" },
    { clave: "monto", etiqueta: "Monto", tipo: "number" as const, columnas: "col-6" },
  ];

  it("Agregar suma una fila vacía con todos los campos", () => {
    const alCambiar = jasmine.createSpy("onCambio");
    const contenedor = renderizar(<ListaEditable nombre="bienes" titulo="Bienes" campos={campos} filas={[]} errores={{}} onCambio={alCambiar} />);

    expect(contenedor.textContent).toContain("Sin registros.");
    hacerClick(boton(contenedor, "+ Agregar"));
    expect(alCambiar).toHaveBeenCalledWith([{ nombre: "", monto: "" }]);
  });

  it("editar y quitar avisan la lista nueva, y muestra el error de cada campo", () => {
    const alCambiar = jasmine.createSpy("onCambio");
    const filas: FilaEditable[] = [{ nombre: "Casa", monto: "1" }, { nombre: "Auto" }];
    const contenedor = renderizar(
      <ListaEditable nombre="bienes" titulo="Bienes" campos={campos} filas={filas} errores={{ "bienes.1.monto": "Obligatorio." }} onCambio={alCambiar} />
    );

    expect(contenedor.querySelectorAll(".fila-editable").length).toBe(2);
    expect(contenedor.querySelector("#bienes-1-monto")!.classList).toContain("is-invalid");

    escribir(contenedor.querySelector("#bienes-0-nombre"), "Casa grande");
    expect(alCambiar).toHaveBeenCalledWith([{ nombre: "Casa grande", monto: "1" }, { nombre: "Auto" }]);

    hacerClick(contenedor.querySelectorAll(".fila-editable button")[0]);
    expect(alCambiar).toHaveBeenCalledWith([{ nombre: "Auto" }]);
  });
});

describe("FormularioFicha (CRUD: crear y editar)", () => {
  let espiaPush: jasmine.Spy;

  beforeEach(() => {
    espiaPush = spyOn(routerFalso, "push");
  });

  it("vacío muestra el resumen de errores y no crea nada", () => {
    const contenedor = renderizar(<FormularioFicha hoy="2026-10-28" />);
    hacerClick(contenedor.querySelector("button[type=submit]"));

    expect(contenedor.querySelector("#resumen-errores")!.textContent).toBe("Revisa los 7 campos marcados en rojo.");
    expect(listarFichas().length).toBe(8);
    expect(espiaPush).not.toHaveBeenCalled();
  });

  it("con un solo error el resumen lo dice en singular", () => {
    const contenedor = renderizar(<FormularioFicha fichaInicial={{ ...fichaAlDia, nombre: "" }} hoy="2026-10-28" />);
    hacerClick(contenedor.querySelector("button[type=submit]"));
    expect(contenedor.querySelector("#resumen-errores")!.textContent).toBe("Revisa el campo marcado en rojo.");
  });

  it("crea la ficha con sus listas y va a verla", () => {
    const contenedor = renderizar(<FormularioFicha hoy="2026-10-28" />);
    escribir(contenedor.querySelector("#ficha-rut"), "10.000.013-k");
    escribir(contenedor.querySelector("#ficha-nombre"), "Pedro Prueba Ficticio");
    escribir(contenedor.querySelector("#ficha-nacimiento"), "1950-05-10");
    escribir(contenedor.querySelector("#ficha-defuncion"), "2026-02-01");
    elegir(contenedor.querySelector("#ficha-estado-civil"), "Viudo");
    elegir(contenedor.querySelector("#ficha-region"), "Maule");
    elegir(contenedor.querySelector("#ficha-comuna"), "Talca");
    hacerClick(contenedor.querySelector("#lista-beneficios button"));
    escribir(contenedor.querySelector("#beneficios-0-nombre"), "Cuota mortuoria");
    escribir(contenedor.querySelector("#beneficios-0-monto"), "650000");
    elegir(contenedor.querySelector("#beneficios-0-estado"), "pendiente");

    hacerClick(contenedor.querySelector("button[type=submit]"));

    const creada = obtenerFicha("10000013-K")!;
    expect(creada.comuna).toBe("Talca");
    expect(creada.beneficios).toEqual([{ nombre: "Cuota mortuoria", monto: 650000, estado: "pendiente" }]);
    expect(espiaPush).toHaveBeenCalledOnceWith("/admin/fichas/10000013-K");
  });

  it("al editar el RUT queda bloqueado y se guardan los cambios", () => {
    const contenedor = renderizar(<FormularioFicha fichaInicial={{ ...fichaAlDia, id: "22222222-2" }} hoy="2026-10-28" />);

    expect((contenedor.querySelector("#ficha-rut") as HTMLInputElement).disabled).toBeTrue();
    expect(boton(contenedor, "Guardar cambios")).toBeDefined();
    escribir(contenedor.querySelector("#ficha-nombre"), "Jorge Editado");
    hacerClick(contenedor.querySelector("button[type=submit]"));

    expect(obtenerFicha("22222222-2")!.nombre).toBe("Jorge Editado");
    expect(espiaPush).toHaveBeenCalledOnceWith("/admin/fichas/22222222-2");
  });

  it("sin fecha fija usa la fecha de hoy para validar", () => {
    const contenedor = renderizar(<FormularioFicha fichaInicial={{ ...fichaAlDia, id: "22222222-2", fechaDefuncion: "2999-01-01" }} />);
    hacerClick(contenedor.querySelector("button[type=submit]"));
    expect(contenedor.textContent).toContain("no puede ser futura");
  });
});

describe("VistaAdminFicha", () => {
  it("modo ver muestra la ficha sin botones de solicitud", () => {
    const contenedor = renderizar(<VistaAdminFicha rut="11111111-1" modo="ver" />);
    expect(contenedor.querySelector("article h2")!.textContent).toBe("Rosa Elena Fuentes Araya");
    expect(contenedor.textContent).not.toContain("Agregar a solicitud");
    expect(contenedor.querySelector('a[href="/admin/fichas"]')).not.toBeNull();
  });

  it("modo editar muestra el formulario con los datos cargados", () => {
    const contenedor = renderizar(<VistaAdminFicha rut="11111111-1" modo="editar" />);
    expect((contenedor.querySelector("#ficha-nombre") as HTMLInputElement).value).toBe("Rosa Elena Fuentes Araya");
  });

  it("avisa si el RUT no existe, y aparece si se crea después", () => {
    const contenedor = renderizar(<VistaAdminFicha rut="10000013-K" modo="ver" />);
    expect(contenedor.textContent).toContain("No existe una ficha con el RUT 10000013-K");

    enAct(() => crearFicha({ ...fichaAlDia, id: "10000013-K", nombre: "Ficha Nueva" }));
    expect(contenedor.querySelector("article h2")!.textContent).toBe("Ficha Nueva");
  });
});

describe("TablaSolicitudes", () => {
  it("sin solicitudes explica de dónde vienen", () => {
    const contenedor = renderizar(<TablaSolicitudes />);
    expect(contenedor.textContent).toContain("Todavía no hay solicitudes.");
  });

  it("muestra las más nuevas primero y filtra por estado", () => {
    nuevaSolicitud();
    nuevaSolicitud(SIN_PARENTESCO, [pensionRaul]);
    const contenedor = renderizar(<TablaSolicitudes />);
    const primeraColumna = () => Array.from(contenedor.querySelectorAll("tbody tr td:first-child")).map((td) => td.textContent);

    expect(primeraColumna()).toEqual(["SOL-0002", "SOL-0001"]);
    elegir(contenedor.querySelector("#filtro-estado"), "rechazada");
    expect(primeraColumna()).toEqual(["SOL-0002"]);
    elegir(contenedor.querySelector("#filtro-estado"), "aprobada");
    expect(contenedor.textContent).toContain("No hay solicitudes con ese estado.");
  });
});

describe("DetalleSolicitudAdmin", () => {
  it("Aprobar cambia el estado y esconde la revisión", () => {
    nuevaSolicitud();
    const contenedor = renderizar(<DetalleSolicitudAdmin id="SOL-0001" />);

    hacerClick(boton(contenedor, "Aprobar"));

    expect(obtenerSolicitud("SOL-0001")!.estado).toBe("aprobada");
    expect(contenedor.querySelector("#revision")).toBeNull();
  });

  it("Rechazar exige un motivo y luego lo muestra", () => {
    nuevaSolicitud();
    const contenedor = renderizar(<DetalleSolicitudAdmin id="SOL-0001" />);

    hacerClick(boton(contenedor, "Rechazar"));
    expect(contenedor.textContent).toContain("Escribe el motivo del rechazo.");
    expect(obtenerSolicitud("SOL-0001")!.estado).toBe("ingresada");

    escribir(contenedor.querySelector("#motivo"), "Faltan documentos");
    hacerClick(boton(contenedor, "Rechazar"));
    expect(obtenerSolicitud("SOL-0001")!.estado).toBe("rechazada");
    expect(contenedor.textContent).toContain("Motivo del rechazo: Faltan documentos");
  });

  it("Eliminar borra la solicitud y vuelve al listado", () => {
    const espiaPush = spyOn(routerFalso, "push");
    nuevaSolicitud();
    const contenedor = renderizar(<DetalleSolicitudAdmin id="SOL-0001" />);

    hacerClick(boton(contenedor, "Eliminar solicitud"));
    hacerClick(boton(contenedor, "Sí"));

    expect(obtenerSolicitud("SOL-0001")).toBeUndefined();
    expect(espiaPush).toHaveBeenCalledOnceWith("/admin/solicitudes");
  });

  it("avisa si la solicitud no existe", () => {
    const contenedor = renderizar(<DetalleSolicitudAdmin id="SOL-0404" />);
    expect(contenedor.textContent).toContain("No existe la solicitud SOL-0404");
  });
});

describe("ReportesAdmin", () => {
  it("suma deudas y beneficios de todas las regiones con fichas", () => {
    const contenedor = renderizar(<ReportesAdmin />);

    expect(contenedor.querySelectorAll("#reporte-regiones tbody tr").length).toBe(8);
    expect(contenedor.querySelector("#total-deudas")!.textContent).toBe("$23.010.000");
    expect(contenedor.querySelector("#total-beneficios-reporte")!.textContent).toBe("$19.980.000");
  });

  it("cuenta las solicitudes por estado", () => {
    nuevaSolicitud();
    nuevaSolicitud("Cónyuge", [pensionRaul]);
    enAct(() => {
      cambiarEstadoSolicitud("SOL-0002", "aprobada");
    });
    const contenedor = renderizar(<ReportesAdmin />);
    const filas = Array.from(contenedor.querySelectorAll("#reporte-solicitudes li")).map((li) => li.textContent);

    expect(filas).toEqual(["Ingresada 1$650.000", "Aprobada 1$280.000", "Rechazada 0$0"]);
  });
});
