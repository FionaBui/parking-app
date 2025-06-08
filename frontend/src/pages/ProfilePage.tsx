import { useContext, useEffect, useState } from "react";
import UserContext from "../store/UserContext";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "../types";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { API_BASE_URL } from "../api";

const ProfilePage = () => {
  // Hämtar användare från context
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();

  // Tillstånd för profilinformation (hämtas från backend)
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // useEffect körs vid första render eller när 'user' ändras
  useEffect(() => {
    // Om användare inte finns → skicka till login
    if (!user) {
      navigate("/login");
      return;
    }
    // Funktion för att hämta profildata från backend
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${user.id}`);
        const data = await res.json();
        setProfile(data); // Sätter profildata i state
      } catch (error) {
        console.error("error loading profile", error);
      }
    };
    fetchData();
  }, [user, navigate]);

  // Visar "Loading..." tills profildata är klar
  if (!profile) return <p>Loading...</p>;
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Profile</h2>
      {/* Vänstra kolumnen: Bokade platser */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Your Bookings</Card.Header>
            <Card.Body>
              {profile.rentals.length === 0 ? (
                <p>You haven't booked any parking spots yet.</p>
              ) : (
                // Lista alla bokningar
                <ListGroup>
                  {profile.rentals.map((rental) => (
                    <ListGroup.Item key={rental.id}>
                      <p>
                        <strong>{rental.location}</strong>
                      </p>
                      <p>
                        <strong>Date: </strong>{" "}
                        {new Date(rental.rent_date).toLocaleDateString(
                          "sv-SE",
                          {
                            timeZone: "Europe/Stockholm",
                          }
                        )}
                      </p>
                      <p>
                        <strong>Time: </strong>
                        {rental.rent_start_time.slice(0, 5)} -{" "}
                        {rental.rent_end_time.slice(0, 5)}{" "}
                      </p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        {/* Högra kolumnen: Egen parkeringsplats */}
        <Col md="6" className="mt-4 mt-md-0">
          <Card>
            <Card.Header as="h5">Your Parking Spot</Card.Header>
            <Card.Body>
              {!profile.owner_spot ? (
                <p>You don't own a parking spot.</p>
              ) : (
                // Visa ägd plats
                <ListGroup>
                  <ListGroup.Item>
                    <strong>{profile.owner_spot.location}</strong>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
