import '@/app/globals.css'; 
import { Footer } from "@/components/common/layout/footer";
import { Header } from "@/components/common/layout/header";

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode; // children là optional để preview
}) {
  return (
    <html lang="en">
      {/* Đã xóa font Inter để tránh lỗi */}
      <body className="bg-gray-50 text-gray-800">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow px-8 py-8">
            {/* Trong dự án thật, Next.js sẽ tự truyền page vào children.
                Ở đây, chúng ta hiển thị trang chủ mặc định để preview. */}
            {children }
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}