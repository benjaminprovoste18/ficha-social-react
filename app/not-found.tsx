import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container text-center py-5 flex-grow-1">
      <p className="display-4 fw-bold text-primary mb-2">404</p>
      <h1 className="h4">La dirección que buscas no se encontró</h1>
      <p className="text-body-secondary">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <Link href="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}
