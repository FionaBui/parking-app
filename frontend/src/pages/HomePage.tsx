import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";
import type { SpotStatus } from "../types";
import UserContext from "../store/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "../assets/CSS/HomePage.css";

const HomePage = () => {
  const { user } = useContext(UserContext)!;
  const currentUserId = Number(user?.id);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toLocaleDateString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });
  });

  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [allSpots, setAllSpots] = useState<SpotStatus[]>([]);

  type ToastItem = {
    id: number;
    message: string;
    variant: "success" | "error" | "info";
  };

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    variant: "success" | "error" | "info"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  // Hämta listan igen när nytt datum väljs
  const fetchSpots = useCallback(
    async (date: string) => {
      try {
        const res = await fetch(
          `http://localhost:3001/parking-spots?date=${date}&user=${currentUserId}`
        );
        const data = await res.json();
        console.log("date", date);
        setAllSpots(data);
      } catch (error) {
        console.error("Error fetching parking spots:", error);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    fetchSpots(selectedDate);
  }, [fetchSpots, selectedDate]);

  const selectedSpotDetail = allSpots.find((s) => s.spot_id === selectedSpotId);

  return (
    <>
      <Container fluid>
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 9999 }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              onClose={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              delay={3000}
              autohide
              className={`toast-${toast.variant} mb-2`}
            >
              <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
        <Row>
          <h3 className="text-left mb-3  shadow-sm p-3">Select A Date</h3>
          <Col>
            <DateSelector
              selectedDate={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
            />
          </Col>
        </Row>
      </Container>
      <Container fluid className="mt-4">
        <Row>
          <h3 className="shadow-sm p-3 mb-3">Pick Your Parking Spot</h3>
          <Col md={8}>
            <Card className="p-3 shadow mb-5 bg-body rounded">
              <ParkingMap
                spotStatus={allSpots}
                selectedSpotId={selectedSpotId}
                onSelect={(spotId) => setSelectedSpotId(spotId)}
              />
            </Card>
          </Col>
          <Col md={4}>
            {selectedSpotDetail && (
              <Card className="p-3 shadow">
                <SpotDetails
                  selectedSpot={selectedSpotDetail}
                  selectedDate={selectedDate}
                  onBooked={() => fetchSpots(selectedDate)}
                  currentUserId={currentUserId}
                  showToast={showToast}
                />
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default HomePage;
