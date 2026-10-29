type Props = {
  titulo: string;
  valor: string | number;
  detalle?: string;
  color?: "primary" | "success" | "warning" | "danger" | "info";
};

// Tarjeta de numero grande para el dashboard
export default function TarjetaEstadistica({ titulo, valor, detalle, color = "primary" }: Props) {
  return (
    <div className={"card h-100 border-0 shadow-sm text-bg-" + color}>
      <div className="card-body">
        <p className="small text-uppercase fw-semibold mb-1 opacity-75">{titulo}</p>
        <p className="fs-3 fw-bold mb-0">{valor}</p>
        {detalle && <p className="small mb-0 opacity-75">{detalle}</p>}
      </div>
    </div>
  );
}
