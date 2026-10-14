
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from "./components/Home"
import Jobs from "./components/Jobs"
import Browse from "./components/Browse"
import Profile from './components/Profile'
import About from './components/About'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs  from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicans from './components/admin/Applicans'
import AdminJobsEdit from './components/admin/AdminJobsEdit'
import ProtechtedRoute from './components/admin/ProtechtedRoute'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/Browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/About',
    element: <About />
  },
  {
    path: '/admin/companies',
    element: <ProtechtedRoute><Companies /></ProtechtedRoute>
  },
  {
    path: '/admin/companies/create',
    element: <ProtechtedRoute><CompanyCreate /></ProtechtedRoute>
  },
  {
    path: '/admin/companies/:id',
    element: <ProtechtedRoute><CompanySetup /></ProtechtedRoute>
  },
  {
    path: '/admin/jobs',
    element: <ProtechtedRoute><AdminJobs /></ProtechtedRoute>
  },
  {
    path: '/admin/jobs/create',
    element: <ProtechtedRoute><PostJob /></ProtechtedRoute>
  },
  {
    path: '/admin/jobs/edit/:id',
    element: <ProtechtedRoute><AdminJobsEdit /></ProtechtedRoute>
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ProtechtedRoute><Applicans /></ProtechtedRoute>
  }
])


function App() {


  return (
    <>
      <RouterProvider router={appRouter} />

    </>
  )
}

export default App
