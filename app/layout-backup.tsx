import './globals.css';
import MainLayout from '../src/components/MainLayout';

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
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

