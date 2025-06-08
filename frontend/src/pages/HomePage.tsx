// Importerar React hooks och nödvändiga komponenter
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
import { API_BASE_URL } from "../api";
const HomePage = () => {
  // Hämtar användarinfo från Context
  const { user } = useContext(UserContext)!;
  const currentUserId = Number(user?.id);
  const navigate = useNavigate();

  // Sätter dagens datum som förval
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toLocaleDateString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });
  });
  // Tillstånd för vilken plats som valts
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  // Alla parkeringsplatser med status
  const [allSpots, setAllSpots] = useState<SpotStatus[]>([]);

  // Typ för Toast-meddelanden
  type ToastItem = {
    id: number;
    message: string;
    variant: "success" | "error" | "info";
  };
  // Lista med Toasts att visa
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Funktion för att visa ett Toast-meddelande
  const showToast = (
    message: string,
    variant: "success" | "error" | "info"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  // Hämtar parkeringsplatser för valt datum och användare
  const fetchSpots = useCallback(
    async (date: string) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/parking-spots?date=${date}&user=${currentUserId}`
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

  // Navigerar till login om användare inte är inloggad
  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  // Körs varje gång datumet ändras → hämta nya platser
  useEffect(() => {
    fetchSpots(selectedDate);
  }, [fetchSpots, selectedDate]);

  // Hittar den valda platsens detaljer
  const selectedSpotDetail = allSpots.find((s) => s.spot_id === selectedSpotId);

  return (
    <>
      <Container fluid>
        {/* Container för Toast-meddelanden */}
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
        {/* Datumväljare */}
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
      {/* Karta och detaljer för parkeringsplatser */}
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
          {/* Detaljer visas bara om en plats är vald */}
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
