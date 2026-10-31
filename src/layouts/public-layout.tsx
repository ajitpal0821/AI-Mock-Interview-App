import Header from "@/components/ui/Header"
import Footer from "@/components/ui/footer"
import { Outlet } from "react-router-dom"
export const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
