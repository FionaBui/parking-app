import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/UserContext";
import { Toast, ToastContainer, Form, Button, Nav } from "react-bootstrap";
import "../assets/CSS/LoginPage.css";

const LoginPage = () => {
  // Hämtar login-funktionen från användarkontexten
  const { login } = useContext(UserContext)!;

  // Flikstatus: 'login' eller 'register'
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Formulärfält
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [spotLocation, setSpotLocation] = useState("");

  // Toast-meddelanden
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  // Visar toast-felmeddelanden
  const showError = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const navigate = useNavigate();

  // Hanterar login-formuläret
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Please enter your email");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        showError("Login failed");
        return;
      }
      const user = await res.json();
      login(user); // Sparar användaren i context
      navigate("/"); // Går till startsidan
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showError("Server error");
    }
  };

  // Hanterar register-formuläret
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !apartment) {
      showError("Please fill in all fields");
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
          spot_location: spotLocation || undefined, // frivillig
        }),
      });

      const user = await res.json();
      if (!res.ok) {
        showError(user.error || "Registration failed");
        return;
      }
      login(user); // Direkt inloggning efter registrering
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showError("Server error");
    }
  };
  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      {/* Toast-komponent för felmeddelanden */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className="toast-error"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Navigation tabs för att byta mellan login och register */}
      <Nav variant="pills" className="justify-content-center mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "login"}
            onClick={() => setActiveTab("login")}
            className={activeTab === "login" ? "selected" : "unselected"}
          >
            Login
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "register"}
            onClick={() => setActiveTab("register")}
            className={activeTab === "register" ? "selected" : "unselected"}
          >
            Register
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Login-formulär */}
      {activeTab === "login" && (
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="w-100 login">
            Login
          </Button>
        </Form>
      )}

      {/* Register-formulär */}
      {activeTab === "register" && (
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="regName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regApartment">
            <Form.Label>Apartment info</Form.Label>
            <Form.Control
              type="text"
              placeholder="Example: 1202 or Lgh 3A"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regSpotLocation">
            <Form.Label>Parking Spot (if you own one)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Example: A-1"
              value={spotLocation}
              onChange={(e) => setSpotLocation(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" className="w-100 login">
            Create Account
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginPage;
