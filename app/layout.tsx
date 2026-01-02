import './globals.css';
// Temporariamente sem MainLayout para testar
// import MainLayout from '../src/components/MainLayout';

export const metadata = {
  title: 'ERP G-NESIS',
  description: 'Sistema de Gestão de Obras',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        {/* Temporariamente sem MainLayout para testar se é ele que causa o 404 */}
        {children}
      </body>
    </html>
  );
}
