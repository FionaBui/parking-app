import { useState } from "react";
import type { SpotStatus } from "../types";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../assets/CSS/ParkingMap.css";

// Props-typ: lista över statusar, vald plats-id och callback vid val
type Props = {
  spotStatus: SpotStatus[];
  onSelect: (spotId: number) => void;
  selectedSpotId: number | null;
};

const levels = ["A", "B"];

function ParkingMap({ spotStatus, selectedSpotId, onSelect }: Props) {
  // Tillstånd: vilken våning är vald
  const [selectedLevel, setSelectedLevel] = useState("A");

  // Skapar en lista med 25 platser för vald våning, A-1, A-2, ...
  const spots = Array.from(
    { length: 25 },
    (_, i) => `${selectedLevel}-${i + 1}`
  );

  // Delar upp platserna i fem kolumner för layoutens skull
  const spotColumns = [
    spots.slice(0, 3),
    spots.slice(3, 7),
    spots.slice(7, 12),
    spots.slice(12, 17),
    spots.slice(17, 25),
  ];

  const renderSpots = (spotNumbers: string[]) => {
    return spotNumbers.map((spotNumber) => {
      // Hämta statusinfo för denna plats
      const spot = spotStatus.find((s) => s.spot_number === spotNumber);
      // Är denna plats vald?
      const isSelected = selectedSpotId === spot?.spot_id;

      // Sätt CSS-klasser baserat på status
      let className = "spot-button";
      if (isSelected) {
        className += " selected";
      } else if (spot?.is_rented) {
        className += " rented";
      } else if (spot?.is_owner) {
        className = " owned";
      } else if (spot?.is_available) {
        className = " available";
      }
      // Returnerar en Bootstrap-knapp för varje plats
      return (
        <Button
          key={spotNumber}
          variant="light"
          className={`${className} w-100 fw-bold text-nowrap rounded-0 mb-3 p-0 spot-button`}
          onClick={() => spot && onSelect(spot.spot_id)}
          disabled={!spot}
        >
          {spotNumber}
        </Button>
      );
    });
  };

  return (
    <div className="d-flex flex-column gap-4 ">
      <div className="d-flex gap-2 ">
        {/* Våningsval: A eller B */}
        {levels.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? "primary" : "outline-primary"}
            onClick={() => setSelectedLevel(level)}
            className="floor-btn "
          >
            Floor {level}
          </Button>
        ))}
      </div>
      {/* Legenden – förklarar färger */}
      <div className="d-flex gap-4 justify-content-center align-items-center legend-group">
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box selected"></div>
          <small>Currently selected</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box available"></div>
          <small>Available</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box not-available"></div>
          <small>Not available</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box owned"></div>
          <small>Your own spot</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="legend-box rented"></div>
          <small>Rented</small>
        </div>
      </div>

      {/* Layout för platser */}
      <Container className="mt-4">
        <Row>
          {/* Kolumn vänster */}
          <Col xs={2}>
            <Row className="d-flex flex-column">
              {renderSpots(spotColumns[0])}
            </Row>
            <br />
            <Row className="d-flex flex-column">
              {renderSpots(spotColumns[1])}
            </Row>
          </Col>
          {/* Kolumn mitt */}
          <Col xs={8} className="mt-4">
            <Row className="d-flex justify-content-center">
              <Col xs={3} className="p-0">
                {renderSpots(spotColumns[2])}
              </Col>
              <Col xs={3} className="p-0">
                {renderSpots(spotColumns[3])}
              </Col>
            </Row>
          </Col>
          {/* Kolumn höger */}
          <Col xs={2}>
            <Row className="d-flex flex-column">
              {renderSpots(spotColumns[4])}
            </Row>
          </Col>
        </Row>
        {/* Ingång längst ner */}
        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="border rounded text-center p-2 bg-light fw-bold">
              <i className="fa-solid fa-up-long entrance"></i>
              <br />
              Entrance
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ParkingMap;
