import type { SpotStatus } from "../types";

type Props = {
  spotStatus: SpotStatus[];
  onSelect: (spotId: string) => void;
  selectedSpot: string | null;
};

const levels = ["A", "B"];

function ParkingMap({ spotStatus, selectedSpot, onSelect }: Props) {
  return (
    <>
      <div>
        {levels.map((level) => (
          <div key={level}>
            <h3>Våning {level}</h3>
            <div>
              {Array.from({ length: 25 }, (_, i) => {
                const spotId = `${level} - ${i + 1}`;
                const spot = spotStatus.find((s) => s.spot_id === spotId);
                const isRented = spot?.is_rented;
                const isRegistered = spot?.is_registered;
                const isSelected = selectedSpot === spotId;
                let color = "bg-gray-400";
                if (isRented) color = "bg-red-500";
                else if (isRegistered)
                  color = isSelected ? "bg-blue-500" : "bg-green-500";
                return (
                  <button
                    key={spotId}
                    className={`p-4 rounded font-bold text-white ${color}`}
                    onClick={() => onSelect(spotId)}
                    disabled={!isRegistered || isRented}
                  >
                    {spotId}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ParkingMap;
