import { useAuth, UserButton } from '@clerk/react'
import { Loader } from 'lucide-react'
import { Button } from './button'
import { Link } from 'react-router-dom'

export const Profilecontainer = () => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse">
        <Loader className="w-4 h-4 animate-spin text-[#86868b]" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {isSignedIn ? (
        <div className="flex items-center p-0.5 rounded-full border border-[#d2d2d7] dark:border-neutral-700 hover:border-[#86868b] transition-colors">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 rounded-full"
              }
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/signin" className="hidden sm:inline-flex text-xs font-medium text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white px-2.5 py-1.5 transition-colors">
            Sign In
          </Link>
          <Link to="/signup">
            <Button size="sm" className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs px-4 py-1.5 font-medium shadow-none transition-opacity hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
