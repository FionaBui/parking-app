import type { SpotStatus } from "../types";

type Props = {
  selectedSpot: SpotStatus;
  selectedDate: string;
  onBooked: () => void;
  currentUserId: number;
};

function SpotDetails({
  selectedSpot,
  selectedDate,
  onBooked,
  currentUserId,
}: Props) {
  if (!selectedSpot) return null;

  const isMine =
    selectedSpot.renter_id && selectedSpot.renter_id === currentUserId;

  const handleBooking = async () => {
    const res = await fetch("http://localhost:3001/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spot_id: selectedSpot.spot_id,
        renter_id: currentUserId,
        rent_date: selectedDate,
      }),
    });
    if (res.ok) {
      alert("✅ Booking successful!");
      onBooked();
    }
  };

  const handleCancelBooking = async () => {
    const res = await fetch(
      `http://localhost:3001/rentals/cancel?spot=${selectedSpot.spot_id}&user=${currentUserId}&date=${selectedDate}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      alert("Booking cancelled");
      onBooked();
    }
  };

  // Button
  let buttonText = "Book now";
  let isDisabled = false;
  let onClick = handleBooking;

  if (!selectedSpot.is_registered) {
    buttonText = "Not registered";
    isDisabled = true;
  } else if (selectedSpot.is_rented) {
    if (isMine) {
      buttonText = "Cancel booking";
      isDisabled = false;
      onClick = handleCancelBooking;
    } else {
      buttonText = "Already booked";
      isDisabled = true;
    }
  } else if (!selectedSpot.is_available) {
    buttonText = "Busy";
    isDisabled = true;
  }

  const statusText = selectedSpot.is_rented
    ? isMine
      ? "You booked this spot"
      : "Booked"
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
          disabled={isDisabled}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default SpotDetails;
