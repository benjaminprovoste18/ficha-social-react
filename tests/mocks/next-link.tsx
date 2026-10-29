import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
};

// Mock de next/link.
// En las pruebas no hay router de Next, asi que Link se cambia por un <a> normal.
// El preventDefault evita que Karma se vaya a otra pagina al hacer click.
export default function Link({ href, children, prefetch, onClick, ...resto }: Props) {
  void prefetch;

  function manejarClick(evento: MouseEvent<HTMLAnchorElement>) {
    evento.preventDefault();
    if (onClick) onClick(evento);
  }

  return (
    <a href={href} {...resto} onClick={manejarClick}>
      {children}
    </a>
  );
}
