import './globals.css';
import { MainLayout } from '../src/components/layout';
import { ThemeProvider } from '../src/contexts/ThemeContext';

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
        <ThemeProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
