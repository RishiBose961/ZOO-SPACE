import { Route, Routes } from "react-router"
import Navbar from "./components/Header/Navbar"
import Home from "./pages/Home/Home"
import RegisterDsc from "./pages/Dsc/RegisterDsc"
import ViewDsc from "./pages/Dsc/ViewDsc"
import AuthPage from "./pages/Autrh/Auth"
import PrivateRoute from "./components/PrivateRoute"
import useAuthEffect from "./components/useAuthEffect"
const App = () => {
  const isauth = false
  useAuthEffect();

  return (
    <div className="max-w-6xl mx-auto px-2">
      {
        isauth ? null : <Navbar />
      }

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dsc-register" element={<RegisterDsc />} />
          <Route path="/dsc-manage" element={<ViewDsc />} />
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

    </div>
  )
}

export default App