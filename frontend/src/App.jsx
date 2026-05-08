import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar    from './components/layout/Navbar'
import Footer    from './components/layout/Footer'
import Home      from './pages/Home'
import Launch    from './pages/Launch'
import DeFi      from './pages/DeFi'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0D0818]">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/launch"    element={<Launch />} />
          <Route path="/defi"      element={<DeFi />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App