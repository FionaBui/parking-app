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
      <div className="d-flex flex-column gap-4">
        {levels.map((level) => (
          <div key={level}>
            <h5 className="fw-semibold mb-2">Våning {level}</h5>
            <div className="row row-cols-5 g-2">
              {Array.from({ length: 25 }, (_, i) => {
                const spotId = `${level}-${i + 1}`;
                const spot = spotStatus.find((s) => s.spot_id === spotId);
                const isRented = spot?.is_rented;
                const isRegistered = spot?.is_registered;
                const isSelected = selectedSpot === spotId;
                let btnClass = "btn btn-secondary";
                if (isRented) btnClass = "btn btn-danger";
                else if (isRegistered)
                  btnClass = isSelected ? "btn btn-primary" : "btn btn-success";
                return (
                  <div className="col" key={spotId}>
                    <button
                      className={`${btnClass} w-100 fw-bold`}
                      onClick={() => onSelect(spotId)}
                      disabled={!isRegistered || isRented}
                    >
                      {spotId}
                    </button>
                  </div>
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
