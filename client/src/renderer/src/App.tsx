import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Monitor from './pages/Monitor'
import Settings from './pages/Settings'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Monitor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  )
}

export default App
