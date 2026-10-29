"use client";

import Link from "next/link";
import { useFichas } from "@/lib/hooks";
import { regionPorSlug } from "@/lib/opciones";
import TablaFichas from "../TablaFichas";

type Props = {
  slug: string;
};

// Fichas de una region (como "Categoria #1" en la tienda)
export default function VistaRegion({ slug }: Props) {
  const fichas = useFichas();
  const region = regionPorSlug(slug);

  if (!region) {
    return (
      <div className="alert alert-warning">
        Esa región no existe. <Link href="/regiones">Ver todas las regiones</Link>
      </div>
    );
  }

  const delaRegion = fichas.filter((ficha) => ficha.region === region.nombre);

  return (
    <>
      <h2 className="h3 text-primary">Región de {region.nombre}</h2>
      <p className="text-body-secondary">
        {delaRegion.length} {delaRegion.length === 1 ? "ficha registrada" : "fichas registradas"}.{" "}
        <Link href="/regiones">Ver otras regiones</Link>
      </p>
      <TablaFichas fichas={delaRegion} mensajeVacio="Todavía no hay fichas registradas en esta región." />
    </>
  );
}
