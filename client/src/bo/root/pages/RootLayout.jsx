import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/bo" || location.pathname === "/bo/") {
      navigate("bo/login");
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
