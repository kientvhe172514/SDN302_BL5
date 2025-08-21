import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

export function Providers({children}:{children:React.ReactNode}){
    return(
        <AuthProvider>
            <Toaster position="bottom-right"/>
            {children}
        </AuthProvider>
    )
}