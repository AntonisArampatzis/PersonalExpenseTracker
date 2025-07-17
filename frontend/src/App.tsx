import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import React, { JSX, useEffect, useState } from "react"; //needed when im going from jsx(no need to import ) to tsx
import ProtectedRoute from "./Components/ProtectedRoute";
import axios from "axios";
import AdminHomePage from "./Pages/AdminHomePage";
import RoleCheck from "./Components/AdminCheck";
import AdminCheck from "./Components/AdminCheck";
import UserCheck from "./Components/UserCheck";

function App(): JSX.Element {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Persist Login status after a page refresh
  useEffect(() => {
    const refreshPage = async () => {
      try {
        const refreshPage_response = await axios.get(
          "http://127.0.0.1:5000/auth/verify-token",
          { withCredentials: true }
        );
        console.log("verify token call");
        setIsLogged(true);
        // const role = refreshPage_response.data.role;
        // if (role === "Admin") {
        //   setIsAdmin(true);
        // } else {
        //   setIsAdmin(false);
        // }
        console.log("refreshPage useEffect called");
        console.log(refreshPage_response.data.message);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setIsLogged(false);
          console.log(error.response?.data?.error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    refreshPage();
  }, []);

  return (
    <Router>
      <Routes>
        {/* na dw giati apo home px an alla3w url se login me paei kai pws to mplokarw */}
        <Route path="/register" element={<Signup />} />
        <Route
          path="/"
          element={<Login setIsLogged={setIsLogged} setIsAdmin={setIsAdmin} />}
        />

        {/* Protected Routes - User can't access them without beign logged in */}
        <Route
          element={
            <ProtectedRoute
              isLogged={isLogged}
              setIsLogged={setIsLogged}
              isLoading={isLoading}
              isAdmin={isAdmin}
            />
          }
        >
          <Route
            element={<UserCheck isAdmin={isAdmin} isLoading={isLoading} />}
          >
            <Route path="/home" element={<Home />} />
          </Route>
          <Route
            element={<AdminCheck isAdmin={isAdmin} isLoading={isLoading} />}
          >
            <Route path="/admin" element={<AdminHomePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
