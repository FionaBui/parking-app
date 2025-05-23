import { useNavigate } from "react-router-dom";
function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };
  return (
    <button
      className="btn btn-outline-light btn-sm ms-2"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
export default Logout;
