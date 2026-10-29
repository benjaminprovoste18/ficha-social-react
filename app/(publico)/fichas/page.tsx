import VistaFichas from "@/components/vistas/VistaFichas";

// Equivale a /productos en la tienda
export default function Fichas() {
  return (
    <>
      <h2 className="h3 text-primary">Fichas registradas</h2>
      <p className="text-body-secondary">
        Busca por nombre, RUT o comuna, o filtra las fichas que todavía tienen trámites pendientes.
      </p>
      <VistaFichas />
    </>
  );
}
