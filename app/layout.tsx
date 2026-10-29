import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Ficha Social",
  description: "Sistema de información social para personas fallecidas (datos ficticios, proyecto académico)",
};

// Layout raiz: solo el html y los estilos. El menu publico esta en (publico)/layout.tsx
// y el del panel de administracion en admin/layout.tsx.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body className="d-flex flex-column min-vh-100">{children}</body>
    </html>
  );
}
