import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  clearAuthData,
  getAuthToken,
  getTokenDuration,
} from "../../../shared/utils/authUtil";

function Root() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const tokenDuration = getTokenDuration();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate("/bo/login");
      return;
    }

    if (token === "EXPIRED") {
      clearAuthData();
      navigate("/bo/login");
      return;
    }

    setTimeout(() => {
      clearAuthData();
      navigate("/bo/login");
    }, tokenDuration);
  }, []);

  const logoutHandler = () => {
    clearAuthData();
    navigate("/bo/login");
  };

  // return (
  //   <>
  //     <div>
  //       <button type="button" name="logout" onClick={logoutHandler}>
  //         Logout
  //       </button>
  //       <br />
  //       <Link to="sales">Sales</Link>
  //       <br />
  //       <Link to="items">Items</Link>
  //       <br />
  //       <Link to="categories">Categories</Link>
  //     </div>
  //     <Outlet />
  //   </>
  // );
  return (
    <>
      {tokenDuration > 0 && (
        <>
          <div style={{ position: "absolute", left: "20px", top: "20px" }}>
            <button type="button" name="logout" onClick={logoutHandler}>
              Logout
            </button>
            <br />
            <Link to="sales">Sales</Link>
            <br />
            <Link to="items">Items</Link>
            <br />
            <Link to="categories">Categories</Link>
          </div>
          <Outlet />
        </>
      )}
    </>
  );
}

export default Root;
