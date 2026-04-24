
// import { Button } from './components/ui/button'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './layouts/public-layout'
import Home from './routes/home'
import AuthenticationLayout from './layouts/auth-layout'
import { SignInPage } from './routes/sign-in'
import { SignUpPage } from './routes/sign-up'
import { ProtectedRoutes } from './layouts/protected-routes'
import MainLayout from './layouts/main-layout'
import { Generate } from './components/ui/generate'
import { Dashboard } from './routes/dashboard'
import { CreateEditPage } from './routes/create-edit-page'
import { MockLoadPage } from './routes/mock-load-page'
import MockInterviewPage from './routes/mock-interview-page'
import Feedback from './routes/feedback'
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

          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route path="interview/:interviewId/start" element={<MockInterviewPage />} />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  )
}

export default App