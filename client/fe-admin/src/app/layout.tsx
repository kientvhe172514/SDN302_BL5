
import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/global.css";
export const metadata: Metadata = {
  title: "FAP",
  description: "FPT University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* Prevent FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html { visibility: hidden; }
            html.loaded { visibility: visible; }
            body { opacity: 0; transition: opacity 0.3s ease; }
            body.loaded { opacity: 1; }
            
            /* Critical CSS for immediate display */
            .critical-loading {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .critical-loading.hidden {
              display: none;
            }
          `,
          }}
        />
      </head>
      <body>
        <div id="critical-loading" className="critical-loading">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}></div>
          </div>
        </div>
        {/* <Providers>{children}</Providers> */}
        <Providers>{children}</Providers>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Hide critical loading when app is ready
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                document.documentElement.classList.add('loaded');
                document.body.classList.add('loaded');
                const loadingEl = document.getElementById('critical-loading');
                if (loadingEl) {
                  loadingEl.classList.add('hidden');
                }
              }, 100);
            });
            
            // CSS animation for spinner
            const style = document.createElement('style');
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
          `,
          }}
        />
      </body>
    </html>
  );
}
