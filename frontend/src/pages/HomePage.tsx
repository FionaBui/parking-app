import { useEffect, useState } from "react";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";
import type { SpotStatus } from "../types";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [allSpots, setAllSpots] = useState<SpotStatus[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:3001/parking-spots?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => setAllSpots(data));
    }
  }, [selectedDate]);

  const selectedSpotDetail = allSpots.find((s) => s.spot_id === selectedSpotId);

  return (
    <div className="flex flex-col gap-6">
      <DateSelector
        selectedDate={selectedDate}
        onSelect={(date) => setSelectedDate(date)}
      />
      <div className="d-flex gap-4 mt-4">
        <div className="flex-grow-1">
          <ParkingMap
            spotStatus={allSpots}
            selectedSpotId={selectedSpotId}
            onSelect={(spotId) => setSelectedSpotId(spotId)}
          />
        </div>
        {selectedSpotDetail && (
          <div style={{ minWidth: "280px" }}>
            <SpotDetails selectedSpot={selectedSpotDetail} />
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
