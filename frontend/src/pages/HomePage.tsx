import { useEffect, useState } from "react";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";
import type { SpotStatus } from "../types";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [allSpotStatus, setAllSpotStatus] = useState<SpotStatus[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:3001/parking-spots?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => setAllSpotStatus(data));
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6">
      <DateSelector
        selectedDate={selectedDate}
        onSelect={(date) => setSelectedDate(date)}
      />
      <div className="flex gap-6">
        <ParkingMap
          spotStatus={allSpotStatus}
          selectedSpot={selectedSpot}
          onSelect={(spotId) => setSelectedSpot(spotId)}
        />
        <SpotDetails />
      </div>
    </div>
  );
};
export default HomePage;
