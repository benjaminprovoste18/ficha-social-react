type Props = {
  texto: string;
  soloPendientes: boolean;
  onTextoChange: (texto: string) => void;
  onSoloPendientesChange: (valor: boolean) => void;
};

// Componente "controlado": no guarda estado propio, recibe los valores
// por props y avisa al padre cuando cambian (igual que SearchBar en
// el ejemplo de Thinking in React con los productos).
export default function BarraBusqueda({
  texto,
  soloPendientes,
  onTextoChange,
  onSoloPendientesChange,
}: Props) {
  return (
    <form className="row g-2 align-items-center mb-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-md-8">
        <label htmlFor="buscar" className="visually-hidden">
          Buscar ficha
        </label>
        <input
          id="buscar"
          type="search"
          className="form-control"
          placeholder="Buscar por nombre, RUT o comuna..."
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-4">
        <div className="form-check form-switch">
          <input
            id="solo-pendientes"
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={soloPendientes}
            onChange={(e) => onSoloPendientesChange(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="solo-pendientes">
            Solo con trámites pendientes
          </label>
        </div>
      </div>
    </form>
  );
}
