import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import "@/styles/global.css"
export function Providers({children}:{children:React.ReactNode}){
    return(
        <AuthProvider>
            <Toaster position="bottom-right"/>
            {children}
        </AuthProvider>
    )
}