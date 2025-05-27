import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/UserContext";
import { Form, Button, Nav } from "react-bootstrap";

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
      <Nav variant="pills" className="justify-content-center mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "login"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "register"}
            onClick={() => setActiveTab("register")}
          >
            Register
          </Nav.Link>
        </Nav.Item>
      </Nav>

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
          <Button type="submit" variant="primary" className="w-100">
            Sign in
          </Button>
        </Form>
      )}
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

          <Button type="submit" variant="success" className="w-100">
            Create Account
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginPage;
