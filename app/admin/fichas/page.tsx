import Link from "next/link";
import TablaAdminFichas from "@/components/admin/TablaAdminFichas";

export default function AdminFichas() {
  return (
    <>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <h1 className="h3 mb-0">Fichas</h1>
        <Link href="/admin/fichas/nueva" className="btn btn-primary">
          + Nueva ficha
        </Link>
      </div>
      <TablaAdminFichas />
    </>
  );
}
