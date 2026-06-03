import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../components/layouts/auth-layout";
import Login from "../containers/auth/login";
import useStore from "@/hooks/useStore";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";

const AuthRoutes = () => {
  const { getToken } = useStore();
  const token = getToken();

  if (token) {
    return <Navigate to={siteRoutes.dashboard} replace />;
  }

  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" Component={Login} />
      </Routes>
    </AuthLayout>
  );
};

export default AuthRoutes;
