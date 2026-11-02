import { createContext, useContext } from "react";

export const GuestActionContext = createContext(null);

export function useGuestActions() {
  const context = useContext(GuestActionContext);
  if (!context) throw new Error("useGuestActions must be used within GuestActionProvider");
  return context;
}
