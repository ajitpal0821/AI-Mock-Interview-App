import Header from "@/components/ui/Header"
import Footer from "@/components/ui/footer"
import AuthHandler from "@/handlers/auth-handlers"
import { Outlet } from "react-router-dom"
export const PublicLayout = () => {
    return (
        <div className="w-full">
            <AuthHandler/>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
