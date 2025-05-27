import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";
import type { SpotStatus } from "../types";
import UserContext from "../store/UserContext";
import { Container, Row, Col, Card } from "react-bootstrap";

const HomePage = () => {
  const { user } = useContext(UserContext)!;
  const currentUserId = Number(user?.id);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [allSpots, setAllSpots] = useState<SpotStatus[]>([]);
  // Hämta listan igen när nytt datum väljs
  const fetchSpots = async (date: string) => {
    try {
      const res = await fetch(
        `http://localhost:3001/parking-spots?date=${date}&user=${currentUserId}`
      );
      const data = await res.json();
      setAllSpots(data);
    } catch (error) {
      console.error("Error fetching parking spots:", error);
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    fetchSpots(selectedDate);
  }, [selectedDate]);

  const selectedSpotDetail = allSpots.find((s) => s.spot_id === selectedSpotId);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h3 className="text-center">📅 Select a Date</h3>
          <DateSelector
            selectedDate={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card className="p-3">
            <ParkingMap
              spotStatus={allSpots}
              selectedSpotId={selectedSpotId}
              onSelect={(spotId) => setSelectedSpotId(spotId)}
            />
          </Card>
        </Col>
        <Col md={4}>
          {selectedSpotDetail && (
            <Card className="p-3">
              <SpotDetails
                selectedSpot={selectedSpotDetail}
                selectedDate={selectedDate}
                onBooked={() => fetchSpots(selectedDate)}
                currentUserId={currentUserId}
              />
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default HomePage;
