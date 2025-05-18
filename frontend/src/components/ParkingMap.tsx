import type { SpotStatus } from "../types";

type Props = {
  spotStatus: SpotStatus[];
  onSelect: (spotId: string) => void;
  selectedSpotId: string | null;
};

const levels = ["A", "B"];

function ParkingMap({ spotStatus, selectedSpotId, onSelect }: Props) {
  return (
    <>
      <div className="d-flex flex-column gap-4">
        {levels.map((level) => (
          <div key={level}>
            <h5 className="fw-semibold mb-2">Floor {level}</h5>
            <div className="row row-cols-5 g-2">
              {Array.from({ length: 25 }, (_, i) => {
                const spotId = `${level}-${i + 1}`;
                const spot = spotStatus.find((s) => s.spot_id === spotId);
                const isSelected = selectedSpotId === spotId;

                let btnClass = "btn btn-secondary";
                if (spot?.is_rented) {
                  btnClass = "btn btn-danger";
                } else if (spot?.is_registered) {
                  if (spot.is_available) {
                    btnClass = isSelected
                      ? "btn btn-primary"
                      : "btn btn-success";
                  } else {
                    btnClass = "btn btn-danger";
                  }
                }

                return (
                  <div className="col" key={spotId}>
                    <button
                      className={`${btnClass} w-100 fw-bold`}
                      onClick={() => onSelect(spotId)}
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
