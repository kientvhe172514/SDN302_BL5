'use client'; // Đánh dấu đây là một Client Component

import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/layout/header';
import { Footer } from '@/components/common/layout/footer';
import { Providers } from '@/app/providers';

export function AppLayout({ children }: { children: React.ReactNode }) {
  // Lấy đường dẫn URL hiện tại
  const pathname = usePathname();
  
  // Kiểm tra xem có phải là trang login hay không
  const isLoginPage = pathname === '/authentication/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Chỉ hiển thị Header nếu KHÔNG phải trang login */}
      {!isLoginPage && <Header />}

      {/*
        Thêm class mt-10 (margin-top) một cách có điều kiện
        để đẩy nội dung xuống dưới Header (nếu Header tồn tại)
      */}
      <main className={`flex-grow px-8 py-8 ${!isLoginPage ? 'mt-10' : ''}`}>
        <Providers>
          {children}
        </Providers>
      </main>

      {/* Bạn cũng có thể ẩn Footer trên trang login nếu muốn */}
      {!isLoginPage && <Footer />}
    </div>
  );
}