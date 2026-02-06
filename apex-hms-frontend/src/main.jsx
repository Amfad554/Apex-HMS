import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './pages/SignUp.jsx';
import Login from './pages/login.jsx';

// Import your new Layout and Page
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Overview from './pages/Overview.jsx';
import Staff from './pages/Staff.jsx';
import Patients from './pages/Patient.jsx';
import Appointments from './pages/Appointment.jsx';
import Pharmacy from './pages/Pharmacy.jsx';
import Billing from './pages/Billing.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
       {
        path: "verify-email",
        element: <VerifyEmail />,
      },

      // --- DASHBOARD SECTION ---
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
           {
            path: "patients",
            element: <Patients />,
          },
          {
            path: "staff",
            element: <Staff />,
          },
            {
            path: "appointments",
            element: <Appointments />,
          },
          {
            path: "pharmacy",
            element: <Pharmacy />,
          },
          {
            path: "billing",
            element: <Billing />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)