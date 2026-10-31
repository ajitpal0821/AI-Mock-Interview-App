import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@clerk/react"
import { Menu } from "lucide-react"
import NavigationRoutes from "../NavigationRoutes"
import { NavLink, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Separator } from "./separator"
import { ThemeToggle } from "./theme-toggle"

export const ToggleContainer = () => {
  const { userId, isSignedIn } = useAuth()
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center justify-between w-full pr-6">
              <SheetTitle className="flex items-center gap-2">
                <img src="/assets/svg/logo.svg" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="font-semibold text-base tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  MockAI
                </span>
              </SheetTitle>
              <ThemeToggle />
            </div>
          </SheetHeader>

          <Separator className="bg-[#d2d2d7]/50 dark:bg-neutral-800" />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <NavigationRoutes isMobile onNavigate={handleClose} />
            
            {userId && (
              <NavLink
                to="/generate"
                onClick={handleClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors mt-1",
                    isActive
                      ? "bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]"
                      : "bg-[#f5f5f7] text-[#1d1d1f] dark:bg-neutral-800 dark:text-[#f5f5f7]"
                  )
                }
              >
                Interview Studio
              </NavLink>
            )}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="space-y-3 pt-4 border-t border-[#d2d2d7]/50 dark:border-neutral-800">
          {!isSignedIn ? (
            <Link to="/signin" onClick={handleClose} className="w-full block">
              <Button className="w-full rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium py-2">
                Get Started
              </Button>
            </Link>
          ) : (
            <Link to="/generate" onClick={handleClose} className="w-full block">
              <Button variant="outline" className="w-full rounded-full text-xs font-medium border-[#d2d2d7] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ToggleContainer
