import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 將 App 元件渲染到 index.html 的 root 節點
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)