import '@/app/globals.css';
import { AppLayout } from './AppLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {/* Sử dụng AppLayout để bao bọc children */}
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}