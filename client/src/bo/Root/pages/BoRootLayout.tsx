import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getTokenDuration, getAuthToken } from "../../../shared/utils/authUtil";

function RootLayout() {
  const navigate = useNavigate();
  const tokenDuration = getTokenDuration();

  // useEffect(() => {
  //   navigate("/bo/login");

  //   if (tokenDuration > 0) {
  //     navigate("/pos/sales");
  //     return;
  //   }
  // }, [navigate]);

  // return <>{tokenDuration < 0 && <Outlet />}</>;
  return (
    <>
      <Outlet />
    </>
  );
}

export default RootLayout;
