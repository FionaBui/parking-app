import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import UserContext from "../store/UserContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext)!;
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
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
