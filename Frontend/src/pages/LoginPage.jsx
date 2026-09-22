import React, { useState, useEffect, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Circle } from "lucide-react";

/**
 * ChatLoginPage
 * A login screen for a real-time chat app.
 * Left panel: a looping preview of a live conversation, to sell the "real-time" feel.
 * Right panel: the actual login form.
 *
 * Drop this into any React project. Tailwind's core utility classes are used
 * for layout; a small <style> block handles the custom animations and the
 * few things Tailwind's defaults can't express (custom easing, delays).
 */

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
          <div className={`cp-bubble ${m.from === "me" ? "cp-bubble-me" : "cp-bubble-them"}`}>
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

export default function ChatLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "That email doesn't look right";
    if (!password) next.password = "Enter your password";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      // Wire this up to your auth call.
      setTimeout(() => setSubmitting(false), 1200);
    }
  }

  return (
    <div className="cl-root">
      <style>{css}</style>

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
                  <Circle size={7} className="cp-status-dot" />
                  3 online now
                </div>
              </div>
            </div>
            <ChatPreview />
          </div>
        </div>

        {/* Right: login form */}
        <div className="cl-panel cl-panel-right">
          <form className="cl-form" onSubmit={handleSubmit} noValidate>
            <div className="cl-form-head">
              <h2>Welcome back</h2>
              <p>Log in to pick up where the conversation left off.</p>
            </div>

            <label className="cl-field">
              <span>Email</span>
              <div className={`cl-input ${errors.email ? "cl-input-error" : ""}`}>
                <Mail size={17} strokeWidth={1.8} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="cl-error">{errors.email}</span>}
            </label>

            <label className="cl-field">
              <span>Password</span>
              <div className={`cl-input ${errors.password ? "cl-input-error" : ""}`}>
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
              {errors.password && <span className="cl-error">{errors.password}</span>}
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
              <a href="#" className="cl-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="cl-submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Log in"}
              {!submitting && <ArrowRight size={17} />}
            </button>

            <p className="cl-switch">
              New here? <a href="#">Create an account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const css = `
:root {
  --cl-bg: #14151A;
  --cl-panel: #191A21;
  --cl-ink: #F2F1ED;
  --cl-ink-dim: #9A9AA6;
  --cl-line: #2A2B33;
  --cl-accent: #7C5CFC;
  --cl-accent-ink: #14151A;
  --cl-online: #3ECF8E;
  --cl-danger: #FF6B6B;
}

* { box-sizing: border-box; }

.cl-root {
  min-height: 100vh;
  background: var(--cl-bg);
  color: var(--cl-ink);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.cl-shell {
  width: 100%;
  max-width: 1040px;
  min-height: 620px;
  background: var(--cl-panel);
  border: 1px solid var(--cl-line);
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  overflow: hidden;
}

.cl-panel { padding: 44px 40px; display: flex; flex-direction: column; }

.cl-panel-left {
  background: radial-gradient(120% 140% at 0% 0%, #1D1E29 0%, #121319 70%);
  border-right: 1px solid var(--cl-line);
  justify-content: space-between;
  gap: 28px;
}

.cl-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.cl-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--cl-accent);
  box-shadow: 0 0 0 4px rgba(124, 92, 252, 0.18);
}

.cl-hero h1 {
  font-size: 30px;
  line-height: 1.18;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
}

.cl-hero p {
  margin: 0;
  color: var(--cl-ink-dim);
  font-size: 14.5px;
  line-height: 1.5;
  max-width: 30ch;
}

.cp-card {
  background: #101117;
  border: 1px solid var(--cl-line);
  border-radius: 14px;
  padding: 16px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
}

.cp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }

.cp-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7C5CFC, #4B7BFF);
  flex-shrink: 0;
}

.cp-name { font-size: 13.5px; font-weight: 600; }

.cp-status {
  font-size: 12px;
  color: var(--cl-ink-dim);
  display: flex;
  align-items: center;
  gap: 5px;
}

.cp-status-dot { fill: var(--cl-online); color: var(--cl-online); }

.cp-thread {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.cp-row { display: flex; animation: cp-in 0.35s ease; }
.cp-row-them { justify-content: flex-start; }
.cp-row-me { justify-content: flex-end; }

.cp-bubble {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.4;
}

.cp-bubble-them {
  background: #21222C;
  color: var(--cl-ink);
  border-bottom-left-radius: 4px;
}

.cp-bubble-me {
  background: var(--cl-accent);
  color: #FFFFFF;
  border-bottom-right-radius: 4px;
}

.cp-typing { display: flex; gap: 4px; padding: 11px 14px; }
.cp-typing span {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--cl-ink-dim);
  animation: cp-bounce 1s infinite ease-in-out;
}
.cp-typing span:nth-child(2) { animation-delay: 0.15s; }
.cp-typing span:nth-child(3) { animation-delay: 0.3s; }

@keyframes cp-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-3px); opacity: 1; }
}

@keyframes cp-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.cl-panel-right { justify-content: center; }

.cl-form { width: 100%; max-width: 340px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }

.cl-form-head h2 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 6px;
}

.cl-form-head p {
  margin: 0;
  font-size: 13.5px;
  color: var(--cl-ink-dim);
  line-height: 1.5;
}

.cl-field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--cl-ink-dim); }

.cl-input {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #101117;
  border: 1px solid var(--cl-line);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--cl-ink-dim);
  transition: border-color 0.15s ease;
}

.cl-input:focus-within { border-color: var(--cl-accent); color: var(--cl-ink); }
.cl-input-error { border-color: var(--cl-danger); }

.cl-input input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--cl-ink);
  font-size: 14px;
}

.cl-input input::placeholder { color: #5C5D68; }

.cl-eye {
  background: none;
  border: none;
  color: var(--cl-ink-dim);
  cursor: pointer;
  display: flex;
  padding: 0;
}

.cl-error { color: var(--cl-danger); font-size: 12px; }

.cl-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }

.cl-checkbox { display: flex; align-items: center; gap: 7px; color: var(--cl-ink-dim); cursor: pointer; }
.cl-checkbox input { accent-color: var(--cl-accent); width: 14px; height: 14px; }

.cl-link { color: var(--cl-accent); text-decoration: none; }
.cl-link:hover { text-decoration: underline; }

.cl-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--cl-accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 16px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.1s ease;
}

.cl-submit:hover { filter: brightness(1.08); }
.cl-submit:active { transform: scale(0.99); }
.cl-submit:disabled { opacity: 0.7; cursor: default; }

.cl-switch { margin: 0; text-align: center; font-size: 13px; color: var(--cl-ink-dim); }
.cl-switch a { color: var(--cl-accent); text-decoration: none; }
.cl-switch a:hover { text-decoration: underline; }

@media (max-width: 780px) {
  .cl-shell { grid-template-columns: 1fr; }
  .cl-panel-left { display: none; }
  .cl-panel-right { padding: 40px 24px; }
}
`;