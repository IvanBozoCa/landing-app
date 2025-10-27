import './App.css'
import ConductorView from './pages/ConductorView'

import ApoderadoView from './pages/ApoderadoView'

function App() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px' }}>
      <div style={{ width: '360px', height: '640px', border: '1px solid #ccc', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
        <ConductorView />
      </div>
      <div style={{ width: '360px', height: '640px', border: '1px solid #ccc', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
        <ApoderadoView />
      </div>
    </div>
  )
}

export default App
