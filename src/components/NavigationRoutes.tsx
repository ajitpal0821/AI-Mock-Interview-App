import { MainRoutes } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

interface NavigationRoutesProps {
    isMobile?: boolean;
    onNavigate?: () => void;
}

const NavigationRoutes = ({ isMobile = false, onNavigate }: NavigationRoutesProps) => {
    return (
        <ul className={cn(
            "flex items-center gap-1",
            isMobile && "flex-col items-stretch w-full gap-1"
        )}>
            {MainRoutes.map((route) => (
                <li key={route.href}>
                    <NavLink
                        to={route.href}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            cn(
                                "text-xs font-normal transition-colors duration-150 block",
                                isMobile
                                    ? "px-3 py-2 rounded-md text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    : "px-3 py-1.5 rounded-full text-[#1d1d1f]/75 dark:text-[#f5f5f7]/75 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                                isActive && (
                                    isMobile
                                        ? "bg-neutral-100 text-[#1d1d1f] dark:bg-neutral-800 dark:text-white font-medium"
                                        : "text-[#1d1d1f] dark:text-white font-medium bg-black/[0.04] dark:bg-white/[0.06]"
                                )
                            )
                        }
                    >
                        {route.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    )
}

export default NavigationRoutes