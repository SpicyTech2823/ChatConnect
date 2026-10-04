import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Circle, Phone, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
const PREVIEW_MESSAGES = [
  { from: "them", text: "hey, you free to look at the designs?" },
  { from: "me", text: "just opened them, one sec" },
  { from: "them", text: "no rush — early feedback is fine too" },
  { from: "me", text: "ok this login screen is clean" },
];

function ChatPreview() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      while (!cancelled) {
        setVisible(0);
        setTyping(false);
        for (let i = 0; i < PREVIEW_MESSAGES.length; i++) {
          await wait(900);
          if (cancelled) return;
          setTyping(true);
          await wait(1100);
          if (cancelled) return;
          setTyping(false);
          setVisible(i + 1);
        }
        await wait(2200);
      }
    }

    function wait(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="cp-thread">
      {PREVIEW_MESSAGES.slice(0, visible).map((m, i) => (
        <div
          key={i}
          className={`cp-row ${m.from === "me" ? "cp-row-me" : "cp-row-them"}`}
        >
          <div
            className={`cp-bubble ${m.from === "me" ? "cp-bubble-me" : "cp-bubble-them"}`}
          >
            {m.text}
          </div>
        </div>
      ))}
      {typing && (
        <div className="cp-row cp-row-them">
          <div className="cp-bubble cp-bubble-them cp-typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "That email doesn't look right";
    if (!name.trim()) next.name = "Enter your name";
    if (!password) next.password = "Enter your password";
    else if (password.length < 8) next.password = "Use at least 8 characters";
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      try {
        await register(name.trim(), email.trim(), password, number.trim());
      } catch (error) {
        setErrors({ form: error.message });
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <div className="cl-root">
      <div className="cl-shell">
        {/* Left: live preview panel */}
        <div className="cl-panel cl-panel-left">
          <div className="cl-brand">
            <span className="cl-dot" />
            Wavelength
          </div>

          <div className="cl-hero">
            <h1>
              Conversations,
              <br />
              as they happen.
            </h1>
            <p>No refreshing. No waiting. Just a room that's always live.</p>
          </div>

          <div className="cp-card">
            <div className="cp-header">
              <div className="cp-avatar" />
              <div>
                <div className="cp-name">Design Review</div>
                <div className="cp-status">
                  <Circle size={7} className="cp-status-dot" />3 online now
                </div>
              </div>
            </div>
            <ChatPreview />
          </div>
        </div>

        {/* Right Register form */}
        <div className="cl-panel cl-panel-right">
          <form className="cl-form" onSubmit={handleSubmit} noValidate>
            <div className="cl-form-head">
              <h2>Create an account</h2>
              <p>Join us to start chatting!</p>
            </div>
            {errors.form && <span className="cl-error" role="alert">{errors.form}</span>}
            <label className="cl-field">
              <span>Name</span>
              <div className={`cl-input`}>
              <User size={17} strokeWidth={1.8}/>
                <input
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex deo"
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="cl-error">{errors.name}</span>}
            </label>

            <label className="cl-field">
              <span>Email</span>
              <div
                className={`cl-input ${errors.email ? "cl-input-error" : ""}`}
              >
                <Mail size={17} strokeWidth={1.8} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className = "text-white "
                />
              </div>
              {errors.email && <span className="cl-error">{errors.email}</span>}
            </label>
            <label className="cl-field">
              <span>Phone number</span>
              <div
                className={`cl-input`}
              >
                <Phone size={17} strokeWidth={1.8} />
                <input
                  type="tel"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="+855 xxx xxx"
                  autoComplete="number"
                />
              </div>
              {errors.number && <span className="cl-error">{errors.number}</span>}
            </label>
            <label className="cl-field">
              <span>Password</span>
              <div
                className={`cl-input ${errors.password ? "cl-input-error" : ""}`}
              >
                <Lock size={17} strokeWidth={1.8} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cl-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <span className="cl-error">{errors.password}</span>
              )}
            </label>
            <label className="cl-field">
              <span>Confirm Password</span>
              <div
                className={`cl-input ${errors.confirmPassword ? "cl-input-error" : ""}`}
              >
                <Lock size={17} strokeWidth={1.8} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cl-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="cl-error">{errors.confirmPassword}</span>
              )}
            </label>

            <div className="cl-row">
              <label className="cl-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Stay signed in</span>
              </label>
            </div>

            <button type="submit" className="cl-submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
              {!submitting && <ArrowRight size={17} />}
            </button>

            <p className="cl-switch">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
