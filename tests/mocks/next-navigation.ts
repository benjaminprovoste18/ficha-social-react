// Mock de next/navigation.
// Los componentes llaman useRouter() y usePathname() como siempre, pero en
// las pruebas reciben estos objetos falsos que podemos espiar con Jasmine.

export const routerFalso = {
  push(url: string) {
    void url;
  },
  replace(url: string) {
    void url;
  },
  back() {},
  refresh() {},
};

export const navegacionFalsa = {
  rutaActual: "/",
};

export function useRouter() {
  return routerFalso;
}

export function usePathname() {
  return navegacionFalsa.rutaActual;
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}
