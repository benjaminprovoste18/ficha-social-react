import Image from "next/image";
import Link from "next/link";
import TarjetaFuncion from "@/components/TarjetaFuncion";

// Las mismas funciones que estaban en principal.html, ahora como datos
// que se le pasan por props al componente TarjetaFuncion.
const funciones = [
  {
    titulo: "Consulta por RUT",
    descripcion: "Ingresa un RUT, valida el dígito verificador y revisa la ficha social de la persona.",
    enlace: "/consultar",
    textoEnlace: "Consultar",
  },
  {
    titulo: "Fichas por región",
    descripcion: "Revisa las fichas agrupadas por región, o búscalas por nombre, RUT o comuna.",
    enlace: "/regiones",
    textoEnlace: "Ver regiones",
  },
  {
    titulo: "Solicitud de beneficios",
    descripcion: "Elige los beneficios pendientes, como la cuota mortuoria, y envía la solicitud de cobro.",
    enlace: "/beneficios",
    textoEnlace: "Ver beneficios",
  },
  {
    titulo: "Administración",
    descripcion: "Crea, edita y elimina fichas, revisa las solicitudes y mira los reportes por región.",
    enlace: "/admin",
    textoEnlace: "Ir al panel",
  },
];

export default function Home() {
  return (
    <>
      <section className="portada text-white rounded-3 p-4 p-md-5 mb-4 shadow-sm">
        <h1 className="display-6 fw-bold">Sistema de Ficha Social</h1>
        <p className="lead mb-4">Sistema de información social para personas fallecidas</p>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Link href="/consultar" className="btn btn-light btn-lg">
            Consultar ficha
          </Link>
          <Link href="/fichas" className="btn btn-outline-light btn-lg">
            Ver fichas registradas
          </Link>
        </div>
      </section>

      <section className="row align-items-center g-4 mb-5">
        <div className="col-12 col-md-7">
          <h2 className="h3 text-primary">Bienvenido</h2>
          <p>
            Este sistema permite consultar la información de una ficha social utilizando el RUT
            de la persona fallecida. La idea es que la familia pueda ver en un solo lugar los
            trámites que quedan pendientes, como deudas, beneficios por cobrar o documentos.
          </p>
          <p className="text-body-secondary small mb-0">
            Como no es legal usar datos reales de personas, todas las fichas son inventadas.
          </p>
        </div>
        <div className="col-12 col-md-5 text-center">
          <Image
            src="/img/familia.jpg"
            alt="Ilustración de una familia"
            width={474}
            height={474}
            className="imagen-inicio rounded-3 shadow-sm"
            priority
          />
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h3 text-primary mb-3">Funciones del sistema</h2>
        <div className="row g-3">
          {funciones.map((funcion) => (
            <div className="col-12 col-sm-6 col-lg-3" key={funcion.titulo}>
              <TarjetaFuncion {...funcion} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2 className="h3 text-primary mb-3">Video relacionado</h2>
        <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm" style={{ maxWidth: 720 }}>
          <iframe
            src="https://www.youtube.com/embed/0wz6RfUXT0w"
            title="Video sobre temática social"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </>
  );
}
