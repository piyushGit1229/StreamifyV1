import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiPlay } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { safeReturnTo } from "../../components/common/authReturn";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login({
      email: form.email,
      password: form.password,
    });

    setIsLoading(false);
    if (success) navigate(returnTo, { replace: true });
  };

  return (
    <main className="sf-auth-page sf-auth-page-login">
      <div className="sf-auth-layout">
        <aside className="sf-auth-story" aria-label="About Streamify">
          <Link to="/" className="sf-auth-logo" aria-label="Streamify home">
            <span className="sf-brand-mark"><FiPlay size={18} fill="currentColor" /></span>
            <span>Streamify</span>
          </Link>

          <div className="sf-auth-composition" aria-hidden="true">
            <div className="sf-auth-orbit sf-auth-orbit-one" />
            <div className="sf-auth-orbit sf-auth-orbit-two" />
            <div className="sf-auth-poster sf-auth-poster-back"><span>CREATORS</span></div>
            <div className="sf-auth-poster sf-auth-poster-front">
              <span className="sf-auth-poster-play"><FiPlay size={22} fill="currentColor" /></span>
              <span className="sf-auth-poster-caption">A WORLD OF STORIES</span>
            </div>
            <span className="sf-auth-float-label">Your next favorite is here</span>
          </div>

          <div className="sf-auth-story-copy">
            <span className="sf-auth-eyebrow">WATCH WHAT MOVES YOU</span>
            <h2>More than a feed.<br />A feeling you come back to.</h2>
            <p>Find your creators, collect the videos you love, and watch together.</p>
          </div>
          <span className="sf-auth-story-foot">Discover · Create · Connect</span>
        </aside>

        <section className="sf-auth-form-panel">
          <div className="sf-auth-mobile-brand">
            <span className="sf-brand-mark"><FiPlay size={17} fill="currentColor" /></span>
            <span>Streamify</span>
          </div>
          <header className="sf-auth-form-heading">
            <span className="sf-auth-eyebrow">YOUR STREAM STARTS HERE</span>
            <h1>Welcome back</h1>
            <p>Sign in to pick up where you left off.</p>
          </header>

          <form onSubmit={submit} className="sf-auth-form">
            <div className="sf-auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="sf-auth-input-wrap">
                <FiMail aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="sf-auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="sf-auth-input-wrap">
                <FiLock aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="sf-auth-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="sf-auth-submit">
              <span>{isLoading ? "Signing in…" : "Sign in"}</span>
              {isLoading ? <span className="sf-auth-spinner" aria-hidden="true" /> : <FiArrowRight aria-hidden="true" />}
            </button>

            <p className="sf-auth-switch">
              New to Streamify? <Link to={`/signup?returnTo=${encodeURIComponent(returnTo)}`}>Create an account</Link>
            </p>
            <Link to={returnTo} className="sf-auth-guest">Continue as guest <FiArrowRight aria-hidden="true" /></Link>
          </form>
          <p className="sf-auth-form-foot">Your stories, playlists and watch parties are waiting.</p>
        </section>
      </div>
    </main>
  );
}
