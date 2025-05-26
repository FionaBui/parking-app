import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/UserContext";

const LoginPage = () => {
  const { login } = useContext(UserContext)!;
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [spotLocation, setSpotLocation] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        alert("Login failed");
        return;
      }
      const user = await res.json();
      login(user);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Server error");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !apartment) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          apartment_info: apartment,
          spot_location: spotLocation || undefined,
        }),
      });

      const user = await res.json();
      if (!res.ok) {
        alert(user.error || "Registration failed");
        return;
      }
      login(user);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Server error");
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <ul
        className="nav nav-pills mb-3 justify-content-center"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="loginEmail">
                Email address
              </label>
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="loginPassword">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Sign in
            </button>
          </form>
        )}
        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="regName">
                Name
              </label>
              <input
                type="text"
                id="regName"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="regEmail">
                Email
              </label>
              <input
                type="email"
                id="regEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="regPassword">
                Password
              </label>
              <input
                type="password"
                id="regPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="regApartment">
                Apartment
              </label>
              <input
                type="text"
                id="regApartment"
                className="form-control"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="regSpotLocation">
                Your parking spot (optional if you own one)
              </label>
              <input
                type="text"
                id="regSpotLocation"
                className="form-control"
                value={spotLocation}
                onChange={(e) => setSpotLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
