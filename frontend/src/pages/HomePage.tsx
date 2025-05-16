import { useState } from "react";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [rentedSpots, setRentedSpots] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <DateSelector
        selectedDate={selectedDate}
        onSelect={(date) => setSelectedDate(date)}
      />
      <div className="flex gap-6">
        <ParkingMap
          rentedSpots={rentedSpots}
          selectedSpot={selectedSpot}
          onSelect={(spotId) => setSelectedSpot(spotId)}
        />
        <SpotDetails />
      </div>
    </div>
  );
};
export default HomePage;
