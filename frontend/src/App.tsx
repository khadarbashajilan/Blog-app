import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BlogsListPage from './pages/BlogsListPage'
import BlogPage from './pages/BlogPage'
import LoginPage from './pages/LoginPage'

const routes = [
  {
    path: "/",
    element: <Layout/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: "/",
        element:<HomePage/>
      },
      {
        path: "/blogs",
        element: <BlogsListPage/>
      },
      {
        path:"/blogs/:id",
        element: <BlogPage/>
      },
      {
        path:'/login',
        element:<LoginPage/>
      }
    ]
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
