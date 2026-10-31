import Header from "@/components/ui/Header"

import { Outlet } from "react-router-dom"
import { Container } from "@/components/ui/container"
import Footer from "@/components/ui/footer"
const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <Container className="flex-1 w-full py-6">
                <main className="w-full">
                    <Outlet />
                </main>
            </Container>
            <Footer />
        </div>
    )
}
export default MainLayout
