type Props = {
  texto: string;
};

export default function PiePagina({ texto }: Props) {
  return (
    <footer className="bg-secondary text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0 small">{texto}</p>
      </div>
    </footer>
  );
}
