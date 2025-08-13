import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import BionicConverter from './pages/BionicConverter'
import Translator from './pages/Translator'
import PDFProcessor from './pages/PDFProcessor'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bionic-converter" element={<BionicConverter />} />
            <Route path="/translator" element={<Translator />} />
            <Route path="/pdf-processor" element={<PDFProcessor />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
