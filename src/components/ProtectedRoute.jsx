import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ProfileAPI } from "../services/ProfileAPI";
import { setupAutoLogout } from "../utils/autoLogout";

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const [authState, setAuthState] = useState(() => ({
    status: token ? "checking" : "unauthenticated",
    role: "",
  }));
  const allowedRolesKey = useMemo(() => allowedRoles.join("|"), [allowedRoles]);

  useEffect(() => {
    if (!token) {
      setAuthState({
        status: "unauthenticated",
        role: "",
      });
      return undefined;
    }

    let isActive = true;

    const syncSession = async () => {
      try {
        const currentUser = await ProfileAPI.getCurrentUser();
        if (!isActive) return;

        const resolvedRole = currentUser?.role || "";

        if (currentUser?.id !== undefined) {
          localStorage.setItem("user_id", String(currentUser.id));
        }
        localStorage.setItem("user_name", currentUser?.name || "");
        localStorage.setItem("user_role", resolvedRole);

        const isAllowed =
          allowedRoles.length === 0 ||
          allowedRoles.some(
            (allowedRole) => normalizeRole(allowedRole) === normalizeRole(resolvedRole),
          );

        setAuthState({
          status: isAllowed ? "authorized" : "forbidden",
          role: resolvedRole,
        });
      } catch (error) {
        console.error("Protected route auth check failed:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");

        if (!isActive) return;

        setAuthState({
          status: "unauthenticated",
          role: "",
        });
      }
    };

    setAuthState((current) => ({
      ...current,
      status: "checking",
    }));
    syncSession();

    return () => {
      isActive = false;
    };
  }, [token, allowedRolesKey]);

  useEffect(() => {
    if (authState.status !== "authorized") return undefined;

    const handleLogout = () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      navigate("/login?message=Logged out due to inactivity");
    };

    const cleanup = setupAutoLogout(handleLogout, 60);

    return cleanup;
  }, [authState.status, navigate]);

  if (authState.status === "checking") {
    return null;
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (authState.status === "forbidden") {
    if (normalizeRole(authState.role) === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
