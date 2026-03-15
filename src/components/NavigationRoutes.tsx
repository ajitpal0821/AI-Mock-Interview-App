import { MainRoutes } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

interface NavigationRoutes {
    isMobile?: boolean
}

const NavigationRoutes = ({ isMobile = false }: NavigationRoutes) => {
    return (
        // <nav className={cn("hidden md:flex items-center gap-3")}>
        <ul className={cn("flex items-center gap-6",isMobile && "items-start flex-col gap-8")}>
            {MainRoutes.map((route) => (
                <NavLink
                    key={route.href}
                    to={route.href}
                    className={({ isActive }) =>
                        cn(
                            "text-base text-neutral-600",
                            isActive && "text-neutral-900 font-semibold"
                        )
                    }
                >
                    {route.label}
                </NavLink>
            ))}
        </ul>

        // </nav>
    )
}

export default NavigationRoutes