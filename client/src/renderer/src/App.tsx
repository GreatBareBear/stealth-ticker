import { ErrorBoundary } from "./ErrorBoundary"
import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Monitor from './pages/Monitor'
import Settings from './pages/Settings'
import About from './pages/About'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Monitor />} />
        <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  )
}

export default App
