import { useContext, useEffect, useState } from "react";
import UserContext from "../store/UserContext";
import { useNavigate } from "react-router-dom";
import type { ProfileData } from "../types";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const ProfilePage = () => {
  const { user } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${user.id}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("error loading profile", error);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (!profile) return <p>Loading...</p>;
  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Profile</h2>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Your Bookings</Card.Header>
            <Card.Body>
              {profile.rentals.length === 0 ? (
                <p>You haven't booked any parking spots yet.</p>
              ) : (
                <ListGroup>
                  {profile.rentals.map((rental) => (
                    <ListGroup.Item key={rental.id}>
                      <p>
                        <strong>{rental.location}</strong>
                      </p>
                      <p>
                        <strong>Date: </strong> {rental.rent_date.slice(0, 10)}
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
        <Col md="6" className="mt-4 mt-md-0">
          <Card>
            <Card.Header as="h5">Your Parking Spot</Card.Header>
            <Card.Body>
              {!profile.owner_spot ? (
                <p>You don't own a parking spot.</p>
              ) : (
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
