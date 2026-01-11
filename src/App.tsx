import { Route, Routes } from "react-router"
import Navbar from "./components/Header/Navbar"
import Home from "./pages/Home/Home"
import RegisterDsc from "./pages/Dsc/RegisterDsc"
const App = () => {
  return (
    <div className="max-w-6xl mx-auto px-2">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dsc-dashboard" element={<RegisterDsc/>} />
          <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      
    </div>
  )
}

export default App