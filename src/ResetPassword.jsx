import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "./api";

function readUserEmail() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}")?.email || "your account";
  } catch {
    return "your account";
  }
}

const passwordRules = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One number or symbol", test: (value) => /[\d\W_]/.test(value) },
];

export default function ResetPassword() {
  const location = useLocation();
  const token = useMemo(
    () => new URLSearchParams(location.search).get("token") || "",
    [location.search],
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const email = readUserEmail();
  const validRules = passwordRules.every((rule) => rule.test(password));

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This reset link is missing its token. Open the link from your reset email.");
      return;
    }
    if (!validRules) {
      setError("Your password does not meet all the requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/reset-password", {
        token,
        password,
      });
      setSuccess(response.data.message || "Your password has been reset. You can now log in.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "We could not reset your password. Please request a new reset link or try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="reset-page">
      <section className="reset-card" aria-labelledby="reset-title">
        <Link className="reset-back" to="/login" aria-label="Back to log in">
          <span aria-hidden="true">‹</span>
        </Link>
        <div className="reset-check" aria-hidden="true">OK</div>
        <h1 id="reset-title">Reset Your Password</h1>
        <p className="reset-subtitle">
          Create a new password for {email}
        </p>

        {error && <p className="form-message form-message-error" role="alert">{error}</p>}
        {success && (
          <p className="form-message form-message-success" role="status">
            {success} <Link to="/login">Log in</Link>
          </p>
        )}

        <form className="reset-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="new-password">New password</label>
          <div className="reset-password-field">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          <label className="visually-hidden" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            className="reset-input"
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <ul className="password-rules" aria-label="Password requirements">
            {passwordRules.map((rule) => {
              const passed = rule.test(password);
              return (
                <li className={passed ? "rule-passed" : ""} key={rule.label}>
                  <span aria-hidden="true">{passed ? "✓" : "+"}</span>
                  {rule.label}
                </li>
              );
            })}
          </ul>

          <button
            className="reset-submit"
            type="submit"
            disabled={loading || Boolean(success)}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
