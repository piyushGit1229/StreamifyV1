import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowRight, FiLock, FiPlay, FiX } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { GuestActionContext, useGuestActions } from "./guestActionContext";
import { safeReturnTo } from "./authReturn";

export function GuestActionProvider({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const returnTo = safeReturnTo(`${location.pathname}${location.search}${location.hash}`);

  const requireAuth = useCallback(() => {
    const auth = useAuthStore.getState();
    if (auth.user) return true;
    if (!auth.initialized && auth.accessToken) return false;
    setIsOpen(true);
    return false;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const authQuery = `?returnTo=${encodeURIComponent(returnTo)}`;
  const dismiss = () => setIsOpen(false);
  const value = useMemo(() => ({ requireAuth }), [requireAuth]);

  return (
    <GuestActionContext.Provider value={value}>
      {children}
      {isOpen && !user && (
        <div className="sf-guest-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
          <section className="sf-guest-modal" role="dialog" aria-modal="true" aria-labelledby="sf-guest-modal-title">
            <button type="button" className="sf-guest-modal-close" onClick={dismiss} aria-label="Close sign-in prompt"><FiX /></button>
            <span className="sf-guest-modal-icon" aria-hidden="true"><FiLock /></span>
            <p className="sf-guest-modal-eyebrow">JOIN THE CONVERSATION</p>
            <h2 id="sf-guest-modal-title">Make this moment yours.</h2>
            <p className="sf-guest-modal-copy">Sign in to save videos, react, subscribe, and join the Streamify community.</p>
            <div className="sf-guest-modal-actions">
              <Link className="sf-guest-modal-primary" to={`/login${authQuery}`} onClick={dismiss}>Sign in <FiArrowRight /></Link>
              <Link className="sf-guest-modal-secondary" to={`/signup${authQuery}`} onClick={dismiss}>Create account</Link>
            </div>
            <button type="button" className="sf-guest-modal-continue" onClick={dismiss}><FiPlay /> Continue watching</button>
          </section>
        </div>
      )}
    </GuestActionContext.Provider>
  );
}

export function RequireSignIn({ children, title = "Your Streamify library", description = "Sign in to access your personal videos and creator tools." }) {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const { requireAuth } = useGuestActions();

  if (!initialized) {
    return <div className="sf-guest-access-check" role="status">Checking your session…</div>;
  }
  if (user) return children;

  return (
    <div className="sf-guest-access-notice">
      <span className="sf-guest-access-icon" aria-hidden="true"><FiLock /></span>
      <p>PERSONAL STREAMIFY</p>
      <h2>{title}</h2>
      <span>{description}</span>
      <div className="sf-guest-access-actions">
        <button type="button" onClick={requireAuth}>Sign in to continue <FiArrowRight /></button>
        <Link to="/">Continue browsing</Link>
      </div>
    </div>
  );
}
