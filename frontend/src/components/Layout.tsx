import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../store/UserContext";
import "../assets/CSS/Layout.css";

const Layout = () => {
  // Hämtar user-objektet och logout-funktion från context
  const { user, logout } = useContext(UserContext)!;
  return (
    <>
      {/* Navigationsfält högst upp */}
      <Navbar expand="lg" className="mb-4 layout-nav">
        <Container fluid className="mx-4">
          {/* Logotypen med länk till startsidan */}
          <Navbar.Brand as={Link} to="/" className="text-white brand">
            <img
              src="/Logo_Parking.png"
              alt="logo-share-parking"
              className="logo-img"
            />
          </Navbar.Brand>
          {/* Knapp för att visa/dölja navbar på mindre skärmar */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          {/* Själva menyinnehållet */}
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                {/* Hälsning med användarnamn */}
                Hello {user?.name}!
              </Nav.Link>
              {/* Om användaren är inloggad, visa profil och logout */}
              {user ? (
                <>
                  <NavDropdown
                    align="end"
                    id="nav-dropdown-dark-example"
                    title={
                      <i className="fa-solid fa-circle-user user-icon"></i>
                    }
                    menuVariant="dark"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                // Om inte inloggad, visa login-länk
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Här visas sidans innehåll beroende på vilken route som är aktiv */}
      <Container fluid>
        <Outlet />
      </Container>
    </>
  );
};
export default Layout;
