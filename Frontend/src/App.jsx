
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
  }, {
    path: '/jobs',
    element: <Jobs />
  }, {
    path: "/description/:id",
    element: <JobDescription />

  }, {
    path: "/Browse",
    element: <Browse />
  }, {
    path: '/profile',
    element: <Profile />
  },
  {
    path:"/About",
    element:<About/>
  },
  // admin 
  {
    path: "/admin/companies",
    element: <ProtechtedRoute> <Companies /></ProtechtedRoute> 
  },{
    path: "/admin/companies/create",
    element:<CompanyCreate/>
  },{
    path:"/admin/companies/:id",
    element:<CompanySetup/>
  },{
    path:"/admin/jobs",
    element:<AdminJobs/>
  },{
    path:"/admin/jobs/create",
    element:<PostJob/>
  },{
    path:"/admin/jobs/edit/:id",
    element:<AdminJobsEdit/>

  },
  
  {
    path:"/admin/jobs/:id/applicants",
    element:<Applicans/>
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
