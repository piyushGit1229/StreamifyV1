import { useEffect } from "react";
import App from "./App";
import { useAuthStore } from "./store/authStore";

export default function AppInitializer() {
  const initializeUser = useAuthStore((state) => state.initializeUser);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  if (!initialized) {
    return <div className="sf-app-initializing" role="status">Preparing your Streamify session…</div>;
  }

  return <App />;
}
