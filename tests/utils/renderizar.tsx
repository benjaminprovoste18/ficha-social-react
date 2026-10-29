import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { restablecerDatos } from "@/lib/baseDatos";

// Le avisa a React que estamos en un entorno de pruebas (para que act funcione bien)
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let montados: { root: Root; contenedor: HTMLElement }[] = [];

// Monta un componente en un div dentro del documento y devuelve ese div,
// asi en la prueba podemos buscar elementos con querySelector.
export function renderizar(elemento: ReactElement): HTMLElement {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const root = createRoot(contenedor);

  act(() => {
    root.render(elemento);
  });

  montados.push({ root, contenedor });
  return contenedor;
}

// Desmonta todo lo que se monto en la prueba anterior
export function limpiar() {
  montados.forEach(({ root, contenedor }) => {
    act(() => {
      root.unmount();
    });
    contenedor.remove();
  });
  montados = [];
}

// Escribe en un input o textarea. React escucha el evento "input", y hay que usar
// el setter nativo para que React detecte que el valor cambio.
export function escribir(input: Element | null, valor: string) {
  const campo = input as HTMLInputElement | HTMLTextAreaElement;
  const prototipo = campo instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototipo, "value")!.set!;

  act(() => {
    setter.call(campo, valor);
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

// Elige una opcion de un select (React escucha el evento "change")
export function elegir(select: Element | null, valor: string) {
  const campo = select as HTMLSelectElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;

  act(() => {
    setter.call(campo, valor);
    campo.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

export function hacerClick(elemento: Element | null) {
  act(() => {
    (elemento as HTMLElement).click();
  });
}

// Para cambiar la base de datos desde la prueba y que React se entere
export function enAct(accion: () => void) {
  act(() => {
    accion();
  });
}

// Busca un boton por su texto
export function boton(contenedor: Element, texto: string): HTMLButtonElement {
  const encontrado = Array.from(contenedor.querySelectorAll("button")).find((b) => b.textContent?.trim() === texto);
  if (!encontrado) throw new Error("No se encontró el botón: " + texto);
  return encontrado;
}

// Antes de cada prueba la "base de datos" vuelve a los datos iniciales
beforeEach(() => {
  restablecerDatos();
});

// Despues de cada prueba se desmonta todo
afterEach(() => {
  limpiar();
});
