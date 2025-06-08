import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "../store/UserContext";

function Logout() {
  const navigate = useNavigate(); // För att navigera efter utloggning
  const { logout } = useContext(UserContext)!; // Hämtar logout-funktion från context

  // Funktion som loggar ut och navigerar till login-sidan
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // Returnerar en Bootstrap-knapp som kör logout vid klick
  return (
    <Button
      variant="outline-light"
      size="sm"
      className="ms-2"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
export default Logout;
