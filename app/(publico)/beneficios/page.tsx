import Link from "next/link";
import VistaBeneficios from "@/components/vistas/VistaBeneficios";

// Equivale a /ofertas en la tienda
export default function BeneficiosPendientes() {
  return (
    <>
      <h2 className="h3 text-primary">Beneficios pendientes de cobro</h2>
      <p className="text-body-secondary">
        Beneficios que la familia todavía puede cobrar. Agrega los que quieras pedir y luego revisa{" "}
        <Link href="/solicitud">tu solicitud</Link>.
      </p>
      <VistaBeneficios />
    </>
  );
}
