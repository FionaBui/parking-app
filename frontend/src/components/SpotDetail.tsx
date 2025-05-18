import type { SpotStatus } from "../types";

type Props = {
  selectedSpot: SpotStatus;
  selectedDate: string;
  onBooked: () => void;
};

function SpotDetails({ selectedSpot, selectedDate, onBooked }: Props) {
  if (!selectedSpot) return null;

  const handleBooking = async () => {
    const res = await fetch("http://localhost:3001/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spot_id: selectedSpot.spot_id,
        renter_id: 3,
        rent_date: selectedDate,
      }),
    });
    if (res.ok) {
      alert("✅ Booking successful!");
      onBooked();
    }
  };

  const statusText = selectedSpot.is_rented
    ? "Booked"
    : selectedSpot.is_available
    ? "Available"
    : selectedSpot.is_registered
    ? "Busy"
    : "Not registered";

  return (
    <>
      <div className="card shadow-sm" style={{ minWidth: "260px" }}>
        <h5>Detail</h5>
        <p>
          <strong>Spot:</strong> {selectedSpot.spot_id}
        </p>
        <p>
          <strong>Status</strong> {statusText}
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
        <button
          className="btn btn-primary w-100 mt-2"
          disabled={
            !selectedSpot.is_registered ||
            selectedSpot.is_rented ||
            !selectedSpot.is_available
          }
          onClick={handleBooking}
        >
          {!selectedSpot.is_registered ||
          selectedSpot.is_rented ||
          !selectedSpot.is_available
            ? "Not available for booking."
            : "Book now"}
        </button>
      </div>
    </>
  );
}

export default SpotDetails;
