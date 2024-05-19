import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useUserLoggedInQuery } from "./features/auth/userAuthApi";
import { useUserAuthChecked } from "./hooks/userUserAuthChecked";
import { UserLayout } from "./layouts/UserLayout";
import { Home } from "./pages/User/Home/Home";
import { UserLogin } from "./pages/User/UserLogin";
import { UserPublicRoute } from "./routes/user/UserPublicRoute";
import { ProgramDetail } from "./pages/User/Course/ProgramDetail";
import { SessionDetail } from "./pages/User/Course/SessionDetail";
import { ContentDetail } from "./pages/User/Course/ContentDetail";
import { Profile } from "./pages/User/Profile/PersonalProfile";

function App() {
  const userAuthChecked = useUserAuthChecked();

  useUserLoggedInQuery();


  return (
    <Routes>
      {/* user routes */}
      <Route path="/" element={<UserLayout />}>

        <Route
          path="/login"
          element={
            <UserPublicRoute>
              <UserLogin />
            </UserPublicRoute>
          }
        />
        //Personal Profile Route
        <Route path="/profile" element={<Profile />} />

        // Programs Routes 
        <Route path="/programs/:programId" element={<ProgramDetail />} />
        <Route path="/programs/:programId/sessions/:sessionId/" element={<SessionDetail />} />
        <Route path="/content/:contentId" element={<ContentDetail />} />

        <Route path="/" element={ userAuthChecked ? <Home /> : <Navigate to="/login" />}  />
        <Route path="/home" element={  <Home />  }  />
      </Route>

    </Routes>
  );
}

export default App;
