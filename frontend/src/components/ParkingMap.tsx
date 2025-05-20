import type { SpotStatus } from "../types";

type Props = {
  spotStatus: SpotStatus[];
  onSelect: (spotId: number) => void;
  selectedSpotId: number | null;
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
                const spotNumber = `${level}-${i + 1}`;
                const spot = spotStatus.find(
                  (s) => s.spot_number === spotNumber
                );
                const isSelected = selectedSpotId === spot?.spot_id;

                let btnClass = "btn btn-secondary";
                if (isSelected) {
                  btnClass = "btn btn-warning";
                } else if (spot?.is_rented) {
                  btnClass = "btn btn-danger";
                } else if (spot?.is_owner) {
                  btnClass = "btn btn-primary";
                } else if (spot?.is_available) {
                  btnClass = "btn btn-success";
                }

                //  Vi gör så att platsen är röd även om den inte är uthyrd, men ägs av någon annan och inte är redo att hyras ut. Detta gör det tydligt för användaren att någon annan redan har registrerat platsen.
                return (
                  <div className="col" key={spotNumber}>
                    <button
                      className={`${btnClass} w-100 fw-bold`}
                      onClick={() => spot && onSelect(spot?.spot_id)}
                    >
                      {spotNumber}
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
