import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiCamera, FiEye, FiEyeOff, FiLock, FiMail, FiPlay, FiUser } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import UserAvatar from "../../components/common/UserAvatar";
import { safeReturnTo } from "../../components/common/authReturn";

export default function SignupPage() {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const [form, setForm] = useState({ name: "", email: "", password: "", avatarUrl: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        avatarUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await signup(form);
    setIsLoading(false);

    if (success) {
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
    }
  };

  return (
    <main className="sf-auth-page sf-auth-page-signup">
      <div className="sf-auth-layout">
        <aside className="sf-auth-story" aria-label="About Streamify">
          <Link to="/" className="sf-auth-logo" aria-label="Streamify home">
            <span className="sf-brand-mark"><FiPlay size={18} fill="currentColor" /></span>
            <span>Streamify</span>
          </Link>

          <div className="sf-auth-composition" aria-hidden="true">
            <div className="sf-auth-orbit sf-auth-orbit-one" />
            <div className="sf-auth-orbit sf-auth-orbit-two" />
            <div className="sf-auth-poster sf-auth-poster-back"><span>COMMUNITY</span></div>
            <div className="sf-auth-poster sf-auth-poster-front">
              <span className="sf-auth-poster-play"><FiPlay size={22} fill="currentColor" /></span>
              <span className="sf-auth-poster-caption">FIND YOUR PEOPLE</span>
            </div>
            <span className="sf-auth-float-label">Made for shared moments</span>
          </div>

          <div className="sf-auth-story-copy">
            <span className="sf-auth-eyebrow">MAKE ROOM FOR MORE</span>
            <h2>Find your people.<br />Build your own stream.</h2>
            <p>Follow creators, save the good stuff, and bring friends into the moment.</p>
          </div>
          <span className="sf-auth-story-foot">Discover · Create · Connect</span>
        </aside>

        <section className="sf-auth-form-panel">
          <div className="sf-auth-mobile-brand">
            <span className="sf-brand-mark"><FiPlay size={17} fill="currentColor" /></span>
            <span>Streamify</span>
          </div>
          <header className="sf-auth-form-heading">
            <span className="sf-auth-eyebrow">START YOUR STREAM</span>
            <h1>Create your account</h1>
            <p>A home for the videos and creators you love.</p>
          </header>

          <form onSubmit={submit} className="sf-auth-form sf-auth-form-signup">
            <label className="sf-auth-avatar-picker" htmlFor="signup-avatar">
              <span className="sf-auth-avatar-wrap">
                <UserAvatar src={form.avatarUrl} name={form.name} alt="Account avatar preview" />
                <span className="sf-auth-avatar-camera"><FiCamera aria-hidden="true" /></span>
              </span>
              <span><strong>Add a profile photo</strong><small>Optional · JPG or PNG</small></span>
              <input id="signup-avatar" type="file" onChange={handleImageUpload} />
            </label>

            <div className="sf-auth-field">
              <label htmlFor="signup-name">Your name</label>
              <div className="sf-auth-input-wrap">
                <FiUser aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="How should we call you?"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="sf-auth-field">
              <label htmlFor="signup-email">Email address</label>
              <div className="sf-auth-input-wrap">
                <FiMail aria-hidden="true" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password">Password</label>
              <div className="sf-auth-input-wrap">
                <FiLock aria-hidden="true" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
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
              <span>{isLoading ? "Creating account…" : "Create account"}</span>
              {isLoading ? <span className="sf-auth-spinner" aria-hidden="true" /> : <FiArrowRight aria-hidden="true" />}
            </button>

            <p className="sf-auth-switch">
              Already have an account? <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Sign in</Link>
            </p>
            <Link to={returnTo} className="sf-auth-guest"><FiArrowRight aria-hidden="true" /> Continue as guest</Link>
          </form>
          <p className="sf-auth-form-foot">Join a community built around what you love to watch.</p>
        </section>
      </div>
    </main>
  );
}
