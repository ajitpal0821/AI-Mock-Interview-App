import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/react"
import { Container } from "./container"
import LogoContainer from "./logo-container"
import NavigationRoutes from "../NavigationRoutes"
import { NavLink } from "react-router-dom"
import { Profilecontainer } from "./profile-container"
import ToggleContainer from "./ToggleContainer"
import { ThemeToggle } from "./theme-toggle"

const Header = () => {
    const { userId } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl transition-all duration-200">
            <Container>
                <div className="flex items-center justify-between h-14 w-full">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-8">
                        <LogoContainer />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <NavigationRoutes />
                            {userId && (
                                <NavLink
                                    to="/generate"
                                    className={({ isActive }) =>
                                        cn(
                                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ml-2",
                                            isActive
                                                ? "bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]"
                                                : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] dark:bg-neutral-800 dark:text-[#f5f5f7]"
                                        )
                                    }
                                >
                                    <span>Interview Studio</span>
                                </NavLink>
                            )}
                        </nav>
                    </div>

                    {/* Right Action / Theme / Profile / Mobile Menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />
                        <Profilecontainer />
                        <ToggleContainer />
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header
