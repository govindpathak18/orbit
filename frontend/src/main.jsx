// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//to provide the redux store to the entire app
import { Provider } from 'react-redux' 
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
<Provider store={ store }>
  <App />
</Provider>
  
)
