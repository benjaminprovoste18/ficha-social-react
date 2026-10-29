import VistaRegiones from "@/components/vistas/VistaRegiones";

// Equivale a la vista de categorias de la tienda
export default function Regiones() {
  return (
    <>
      <h2 className="h3 text-primary">Fichas por región</h2>
      <p className="text-body-secondary">Elige una región para ver sus fichas registradas.</p>
      <VistaRegiones />
    </>
  );
}
