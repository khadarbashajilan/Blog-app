

import './index.css'
import Layout from './layouts/Layout'
import NotFoundPage from './pages/NotFoundPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = [
  {
    path: "/",
    element: <Layout/>,
    errorElement: <NotFoundPage/>,
    children: []
  }
]

function App() {

  const router = createBrowserRouter(routes)

  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
