import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ToolsPage from './pages/ToolsPage'
import AcademicCalendarPage from './pages/AcademicCalendarPage'
import MobileBottomNav from './components/MobileBottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/academic-calendar" element={<AcademicCalendarPage />} />
      </Routes>
      <MobileBottomNav />
    </BrowserRouter>
  )
}
