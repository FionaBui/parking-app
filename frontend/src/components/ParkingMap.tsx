type Props = {
  rentedSpots: string[];
  onSelect: (spotId: string) => void;
  selectedSpot: string | null;
};
const levels = ["A", "B"];

function ParkingMap({ rentedSpots }: Props) {
  return (
    <>
      <div>
        {levels.map((level) => (
          <div key={level}>
            <h3>Våning {level}</h3>
            <div>
              {Array.from({ length: 25 }, (_, i) => {
                const spotId = `${level} - ${i + 1}`;
                const isRented = rentedSpots.includes(spotId);
                return (
                  <button
                    key={spotId}
                    className={`p-4 rounded font-bold text-white ${
                      isRented ? "bg-red-500" : "bg-green-500"
                    }`}
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
