import type { SpotStatus } from "../types";

type Props = {
  selectedSpot: SpotStatus;
};

function SpotDetails({ selectedSpot }: Props) {
  if (!selectedSpot) return null;

  return (
    <>
      <div className="card shadow-sm" style={{ minWidth: "260px" }}>
        <h5>Detail</h5>
        <p>
          <strong>Spot:</strong> {selectedSpot.spot_id}
        </p>
        {selectedSpot.start_time && selectedSpot.end_time && (
          <p>
            <strong>Tid:</strong>
            {new Date(selectedSpot.start_time).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{""}
            {new Date(selectedSpot.end_time).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </>
  );
}

export default SpotDetails;
