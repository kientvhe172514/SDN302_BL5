
import { AppLayout } from './AppLayout';
import '../styles/global.css'
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