import { LoaderPage } from "@/routes/loader-page"
import { useAuth } from "@clerk/react"
import { Navigate, replace } from "react-router-dom"

export const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn } = useAuth()
    if (!isLoaded) {
        return <LoaderPage />
    }

    if (!isSignedIn)
        return <Navigate to={"/signin"} replace />

    return (
        children
    )
}
