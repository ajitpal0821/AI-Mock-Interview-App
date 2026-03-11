import Header from "@/components/ui/Header"
import Footer from "@/components/ui/footer"
import { Outlet } from "react-router-dom"
export const PublicLayout = () => {
    return (
        <div className="w-full">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
