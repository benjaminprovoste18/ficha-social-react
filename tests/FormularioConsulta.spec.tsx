import FormularioConsulta from "@/components/FormularioConsulta";
import { routerFalso } from "./mocks/next-navigation";
import { escribir, hacerClick, renderizar } from "./utils/renderizar";

describe("FormularioConsulta", () => {
  let espiaPush: jasmine.Spy;

  beforeEach(() => {
    // mock del router: espiamos push para saber a donde nos manda el formulario
    espiaPush = spyOn(routerFalso, "push");
  });

  function enviar(contenedor: HTMLElement) {
    hacerClick(contenedor.querySelector("button[type=submit]"));
  }

  it("muestra la operación que recibe por props", () => {
    const contenedor = renderizar(<FormularioConsulta numeroA={10} numeroB={5} />);
    expect(contenedor.querySelector("#operacion")!.textContent).toBe("10 + 5 =");
  });

  it("muestra errores si se envía vacío y no consulta", () => {
    const contenedor = renderizar(<FormularioConsulta />);

    enviar(contenedor);

    expect(contenedor.querySelector("#rut")!.classList).toContain("is-invalid");
    expect(contenedor.querySelector("#respuesta")!.classList).toContain("is-invalid");
    expect(contenedor.textContent).toContain("Debes ingresar un RUT.");
    expect(contenedor.textContent).toContain("Debes responder la operación.");
    expect(espiaPush).not.toHaveBeenCalled();
  });

  it("avisa cuando el dígito verificador está malo", () => {
    const contenedor = renderizar(<FormularioConsulta />);

    escribir(contenedor.querySelector("#rut"), "11111111-9");
    escribir(contenedor.querySelector("#respuesta"), "67");
    enviar(contenedor);

    expect(contenedor.textContent).toContain("El dígito verificador no es correcto.");
    expect(espiaPush).not.toHaveBeenCalled();
  });

  it("avisa cuando la respuesta de verificación es incorrecta", () => {
    const contenedor = renderizar(<FormularioConsulta numeroA={64} numeroB={3} />);

    escribir(contenedor.querySelector("#rut"), "11111111-1");
    escribir(contenedor.querySelector("#respuesta"), "70");
    enviar(contenedor);

    expect(contenedor.querySelector("#rut")!.classList).not.toContain("is-invalid");
    expect(contenedor.textContent).toContain("La respuesta de verificación es incorrecta.");
    expect(espiaPush).not.toHaveBeenCalled();
  });

  it("con datos correctos muestra el mensaje y navega a la ficha con el RUT limpio", () => {
    const contenedor = renderizar(<FormularioConsulta numeroA={64} numeroB={3} />);

    escribir(contenedor.querySelector("#rut"), "44.444.444-4");
    escribir(contenedor.querySelector("#respuesta"), "67");
    enviar(contenedor);

    expect(contenedor.querySelector("#mensaje")!.textContent).toContain("Verificación correcta");
    expect(contenedor.querySelectorAll(".is-invalid").length).toBe(0);
    expect(espiaPush).toHaveBeenCalledOnceWith("/fichas/44444444-4");
  });

  it("'Cambiar operación' genera números nuevos y borra la respuesta", () => {
    // mock de Math.random para que la operacion sea predecible
    spyOn(Math, "random").and.returnValues(0.1, 0.5);
    const contenedor = renderizar(<FormularioConsulta />);
    escribir(contenedor.querySelector("#respuesta"), "67");

    hacerClick(contenedor.querySelector("button[type=button]"));

    expect(contenedor.querySelector("#operacion")!.textContent).toBe("10 + 46 =");
    expect((contenedor.querySelector("#respuesta") as HTMLInputElement).value).toBe("");
  });
});
