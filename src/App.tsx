
// import { Button } from './components/ui/button'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './layouts/public-layout'
import Home from './routes/home'
import AuthenticationLayout from './layouts/auth-layout'
import { SignInPage } from './routes/sign-in'
import { SignUpPage } from './routes/sign-up'
import { ProtectedRoutes } from './layouts/protected-routes'
import MainLayout from './layouts/main-layout'
const App = () => {
  return (
    <Router >
      <Routes>
        {/* public routes */}
        <Route element={<PublicLayout />} >
          <Route index element={<Home />} />{/* display in outlet that we wrote in app.jsx */}
        </Route>

        {/* authentication routes */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signin/*" element={<SignInPage />}></Route>
          <Route path="/signup/*" element={<SignUpPage />}></Route>
        </Route>

        {/* protected routes */}
        <Route element={
          <ProtectedRoutes>
            <MainLayout />
          </ProtectedRoutes>}>

        </Route>

      </Routes>
    </Router>
  )
}

export default App