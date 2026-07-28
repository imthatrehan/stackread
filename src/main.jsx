import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './components/pages/Home.jsx'
import NotFound from './components/pages/NotFound.jsx'
import User from './components/pages/User.jsx'
import Compare from './components/pages/Compare.jsx'
import About from './components/pages/About.jsx'
import PrivacyPolicy from './components/pages/PrivacyPolicy.jsx'
import Terms from './components/pages/Terms.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/user/:username',
        element: <User />,
      },
      {
        path: '/compare',
        element: <Compare />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/terms',
        element: <Terms />,
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
