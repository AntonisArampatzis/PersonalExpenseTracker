import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./Pages/Signup";
import Home from "./Pages/UserHomePage";
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
        console.log(refreshPage_response.data.user_id);
        console.log(refreshPage_response.data.role);
        setIsLogged(true);
        // Only an admin user has role, user has null
        const role = refreshPage_response.data.role;
        if (role === "Admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
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

  // Polling the backend every X seconds to verify if the user's token is still valid
  useEffect(() => {
    if (!isLogged) return;

    const checkToken = setInterval(async () => {
      //one backend call to verify
      try {
        const verify_response = await axios.get(
          "http://127.0.0.1:5000/auth/verify-token",
          { withCredentials: true }
        );
        console.log("verify token call");
        setIsLogged(true);
        // Only an admin user has role, user has null
        const role = verify_response.data.role;
        if (role === "Admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        console.log("Status:", verify_response.data.message);
        console.log("User ID:", verify_response.data.user_id);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.log("Access Token expired");
            //401 = lacks proper authentication credentials or provided invalid credentials
            //backend call to refresh token
            try {
              const refresh_response = await axios.post(
                "http://127.0.0.1:5000/auth/refresh-token",
                {},
                { withCredentials: true }
              );
              console.log("refresh token call");
              console.log(refresh_response.data.message);

              // If refresh was successful backend call to verify token again
              const retry_verify_response = await axios.get(
                "http://127.0.0.1:5000/auth/verify-token",
                { withCredentials: true }
              );
              console.log("verify token call");
              setIsLogged(true);
              // Only an admin user has role, user has null
              const role = retry_verify_response.data.role;
              if (role === "Admin") {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
              console.log("Status:", retry_verify_response.data.message);

              // If refresh fails Logout
            } catch {
              setIsLogged(false);
              console.log("Refresh failed — logging out.");
            }
          } else {
            // Some other API error
            setIsLogged(false);
            console.log("Other error:", error.response?.data?.error);
          }
        } else {
          // Not an axios error
          console.log("Non-axios error:", error);
        }
      }
    }, 15000); // every 5 min=300000

    return () => clearInterval(checkToken);
  }, [isLogged]);
  //forgot [] and had issues now it works,ths [] tells reacts to run useEffect only once,runs when isLogged is true

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
              setIsAdmin={setIsAdmin}
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
