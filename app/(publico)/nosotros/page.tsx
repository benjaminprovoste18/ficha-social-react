const tecnologias = [
  { nombre: "Next.js + React", detalle: "Framework de JavaScript para el frontend, con componentes, props y estados." },
  { nombre: "Bootstrap 5", detalle: "Diseño responsivo con su sistema de grillas, tarjetas, tablas y formularios." },
  { nombre: "Base de datos simulada", detalle: "Archivo JS con funciones CRUD que guarda las fichas y solicitudes en el localStorage." },
  { nombre: "Jasmine + Karma", detalle: "Pruebas unitarias de los componentes y de la lógica de validación." },
];

export default function Page() {
  return (
    <>
      <h2 className="h3 text-primary">Nosotros</h2>
      <p>
        Somos un equipo de estudiantes de DuocUC. Este sistema nace como proyecto de la asignatura
        DSY1104 Desarrollo Fullstack II, con la idea de ordenar en un solo lugar la información
        social de una persona fallecida y facilitarle los trámites a su familia.
      </p>
      <p>
        Todos los datos que se muestran son inventados, porque no es legal publicar información real
        de personas.
      </p>

      <h3 className="h5 mt-4 mb-3">Tecnologías que usamos</h3>
      <div className="row g-3">
        {tecnologias.map((tecnologia) => (
          <div className="col-12 col-sm-6 col-lg-3" key={tecnologia.nombre}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="h6 card-title">{tecnologia.nombre}</h4>
                <p className="card-text small text-body-secondary mb-0">{tecnologia.detalle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
