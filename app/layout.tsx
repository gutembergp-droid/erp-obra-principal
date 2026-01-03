import './globals.css';
import { MainLayout } from '../src/components/layout';

export const metadata = {
  title: 'ERP G-NESIS',
  description: 'Sistema de Gestão de Obras - O Corporativo Governa. A Obra Executa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
