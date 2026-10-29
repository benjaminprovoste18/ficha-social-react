import BotonAccion from "@/components/BotonAccion";
import BotonConfirmar from "@/components/BotonConfirmar";
import Campo from "@/components/Campo";
import EstadoBadge, { claseEstado } from "@/components/EstadoBadge";
import PasosSolicitud from "@/components/PasosSolicitud";
import PiePagina from "@/components/PiePagina";
import TarjetaFuncion from "@/components/TarjetaFuncion";
import { boton, elegir, escribir, hacerClick, renderizar } from "./utils/renderizar";

describe("BotonAccion (pruebas de props)", () => {
  it("recibe la etiqueta y la función onClick por props", () => {
    const alHacerClick = jasmine.createSpy("onClick");
    const contenedor = renderizar(<BotonAccion etiqueta="Guardar" onClick={alHacerClick} />);
    const elBoton = contenedor.querySelector("button")!;

    expect(elBoton.textContent).toBe("Guardar");
    hacerClick(elBoton);
    expect(alHacerClick).toHaveBeenCalledTimes(1);
  });

  it("arma las clases de Bootstrap según la variante, el tamaño y el ancho", () => {
    const contenedor = renderizar(<BotonAccion etiqueta="X" variante="outline-danger" tamano="sm" ancho tipo="submit" />);
    const elBoton = contenedor.querySelector("button")!;

    expect(elBoton.className).toBe("btn btn-outline-danger btn-sm w-100");
    expect(elBoton.type).toBe("submit");
  });

  it("si está deshabilitado no ejecuta el onClick", () => {
    const alHacerClick = jasmine.createSpy("onClick");
    const contenedor = renderizar(<BotonAccion etiqueta="X" deshabilitado onClick={alHacerClick} />);

    hacerClick(contenedor.querySelector("button"));
    expect(alHacerClick).not.toHaveBeenCalled();
  });
});

describe("Campo (renderizado condicional)", () => {
  it("el mensaje de error solo aparece cuando hay un error", () => {
    const sinError = renderizar(<Campo id="a" etiqueta="Nombre" valor="" onCambio={() => {}} ayuda="Texto de ayuda" />);
    expect(sinError.querySelector(".invalid-feedback")).toBeNull();
    expect(sinError.querySelector(".form-text")!.textContent).toBe("Texto de ayuda");

    const conError = renderizar(<Campo id="b" etiqueta="Nombre" valor="" onCambio={() => {}} error="Obligatorio." ayuda="Texto" />);
    expect(conError.querySelector(".invalid-feedback")!.textContent).toBe("Obligatorio.");
    expect(conError.querySelector("input")!.classList).toContain("is-invalid");
    expect(conError.querySelector(".form-text")).toBeNull();
  });

  it("avisa cada cambio con onCambio", () => {
    const alCambiar = jasmine.createSpy("onCambio");
    const contenedor = renderizar(<Campo id="c" etiqueta="Correo" tipo="email" valor="" onCambio={alCambiar} obligatorio />);

    escribir(contenedor.querySelector("input"), "a@b.cl");
    expect(alCambiar).toHaveBeenCalledWith("a@b.cl");
    expect(contenedor.querySelector("label")!.textContent).toBe("Correo *");
  });

  it("con opciones se dibuja como select y con tipo textarea como área de texto", () => {
    const alCambiar = jasmine.createSpy("onCambio");
    const select = renderizar(<Campo id="d" etiqueta="Región" valor="" opciones={["Maule", "Ñuble"]} onCambio={alCambiar} />);
    expect(select.querySelectorAll("option").length).toBe(3);
    elegir(select.querySelector("select"), "Ñuble");
    expect(alCambiar).toHaveBeenCalledWith("Ñuble");

    const area = renderizar(<Campo id="e" etiqueta="Notas" tipo="textarea" valor="" onCambio={alCambiar} etiquetaOculta />);
    escribir(area.querySelector("textarea"), "hola");
    expect(alCambiar).toHaveBeenCalledWith("hola");
    expect(area.querySelector("label")!.className).toBe("visually-hidden");
  });
});

describe("BotonConfirmar (estado)", () => {
  it("pregunta antes de ejecutar, y con No se cancela", () => {
    const alConfirmar = jasmine.createSpy("onConfirmar");
    const contenedor = renderizar(<BotonConfirmar etiqueta="Eliminar" pregunta="¿Seguro?" onConfirmar={alConfirmar} />);

    hacerClick(boton(contenedor, "Eliminar"));
    expect(contenedor.textContent).toContain("¿Seguro?");
    hacerClick(boton(contenedor, "No"));

    expect(alConfirmar).not.toHaveBeenCalled();
    expect(boton(contenedor, "Eliminar")).toBeDefined();
  });

  it("con Sí ejecuta la acción una vez", () => {
    const alConfirmar = jasmine.createSpy("onConfirmar");
    const contenedor = renderizar(<BotonConfirmar etiqueta="Eliminar" pregunta="¿Seguro?" onConfirmar={alConfirmar} />);

    hacerClick(boton(contenedor, "Eliminar"));
    hacerClick(boton(contenedor, "Sí"));
    expect(alConfirmar).toHaveBeenCalledTimes(1);
  });
});

describe("EstadoBadge", () => {
  it("usa amarillo para pendiente y en trámite", () => {
    expect(claseEstado("pendiente")).toBe("text-bg-warning");
    expect(claseEstado("En trámite")).toBe("text-bg-warning");
  });

  it("usa celeste para solicitado e ingresada, y rojo para rechazada", () => {
    expect(claseEstado("solicitado")).toBe("text-bg-info");
    expect(claseEstado("ingresada")).toBe("text-bg-info");
    expect(claseEstado("rechazada")).toBe("text-bg-danger");
  });

  it("usa verde para emitido, cobrado, pagada, al día y aprobada", () => {
    ["emitido", "cobrado", "pagada", "al día", "aprobada"].forEach((estado) => {
      expect(claseEstado(estado)).toBe("text-bg-success");
    });
  });

  it("usa gris para un estado desconocido y muestra la primera letra en mayúscula", () => {
    expect(claseEstado("otro")).toBe("text-bg-secondary");
    const contenedor = renderizar(<EstadoBadge estado="cobrado" />);
    expect(contenedor.querySelector(".badge")!.textContent).toBe("Cobrado");
  });
});

describe("TarjetaFuncion, PiePagina y PasosSolicitud", () => {
  it("TarjetaFuncion muestra título, descripción y el botón solo si recibe un enlace", () => {
    const sinEnlace = renderizar(<TarjetaFuncion titulo="Consulta por RUT" descripcion="Ingresa un RUT" />);
    expect(sinEnlace.querySelector("h3")!.textContent).toBe("Consulta por RUT");
    expect(sinEnlace.querySelector("a")).toBeNull();

    const conEnlace = renderizar(<TarjetaFuncion titulo="A" descripcion="B" enlace="/consultar" textoEnlace="Consultar" />);
    expect(conEnlace.querySelector("a")!.getAttribute("href")).toBe("/consultar");
  });

  it("PiePagina muestra el texto recibido", () => {
    const contenedor = renderizar(<PiePagina texto="Proyecto académico" />);
    expect(contenedor.querySelector("footer")!.textContent).toBe("Proyecto académico");
  });

  it("PasosSolicitud marca el paso actual y los anteriores", () => {
    const contenedor = renderizar(<PasosSolicitud paso={2} />);
    const pasos = contenedor.querySelectorAll("li");

    expect(pasos[0].classList).toContain("text-bg-success");
    expect(pasos[1].getAttribute("aria-current")).toBe("step");
    expect(pasos[2].classList).toContain("text-bg-light");
  });
});
