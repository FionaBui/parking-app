import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateSelector from "../components/DateSelector";
import ParkingMap from "../components/ParkingMap";
import SpotDetails from "../components/SpotDetail";
import type { SpotStatus } from "../types";
import UserContext from "../store/UserContext";

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
            <SpotDetails
              selectedSpot={selectedSpotDetail}
              selectedDate={selectedDate}
              onBooked={() => fetchSpots(selectedDate)}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
