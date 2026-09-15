import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import PortfolioAnalytics from './analytics/PortfolioAnalytics.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
    <PortfolioAnalytics />
  </StrictMode>
)

if (root.hasChildNodes() && !window.location.search) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
