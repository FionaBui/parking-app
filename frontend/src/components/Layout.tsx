import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../store/UserContext";
import "../assets/CSS/Layout.css";

const Layout = () => {
  const { user, logout } = useContext(UserContext)!;
  return (
    <>
      <Navbar expand="lg" className="mb-4 layout-nav">
        <Container fluid className="mx-4">
          <Navbar.Brand as={Link} to="/" className="text-white brand">
            <img
              src="../../public/Share_Parking_logo.png"
              alt="logo-share-parking"
              className="logo-img"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    Profile
                  </Nav.Link>
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Outlet />
      </Container>
    </>
  );
};
export default Layout;
