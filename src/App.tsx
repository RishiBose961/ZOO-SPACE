import { Route, Routes } from "react-router"
import Navbar from "./components/Header/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import useAuthEffect from "./components/useAuthEffect"
import AuthManage from "./pages/Admin/AuthManage"
import AuthPage from "./pages/Autrh/Auth"
import GetDscById from "./pages/Dsc/GetDscById"
import RegisterDsc from "./pages/Dsc/RegisterDsc"
import ViewDsc from "./pages/Dsc/ViewDsc"
import Home from "./pages/Home/Home"
import { useServiceWorkerUpdater } from "./useServiceWorkerUpdater"
import { Button } from "./components/ui/button"
import DscExpired from "./pages/Dsc/DscExpired"
const App = () => {
  const isauth = false
  useAuthEffect();

 const { isUpdateAvailable, updateServiceWorker } = useServiceWorkerUpdater();

  return (
    <div className="max-w-6xl mx-auto px-2">
      {
        isauth ? null : <Navbar />
      }

       {isUpdateAvailable && (
        <div className="update-popup">
          <p>A new version is available. Update now?</p>
          <Button onClick={updateServiceWorker}>Update</Button>
        </div>
      )}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dsc-register" element={<RegisterDsc />} />
          <Route path="/dsc-manage" element={<ViewDsc />} />
          <Route path="/auth-manage" element={<AuthManage />} />
          <Route path="/dsc/:id" element={<GetDscById />} />
          <Route path="/dsc-expiry" element={<DscExpired />} />
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

    </div>
  )
}



export default App

