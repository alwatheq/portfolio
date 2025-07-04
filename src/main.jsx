import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { PostHogProvider} from 'posthog-js/react'
import { initPostHog } from './config/posthog.js'



ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>

      <App />
   
  </React.StrictMode>,
)

