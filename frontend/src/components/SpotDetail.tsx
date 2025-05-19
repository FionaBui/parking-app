import { useState } from "react";
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
  const [startTime, setStartTime] = useState(
    selectedSpot.start_time?.slice(11, 16) || "00:00"
  );
  const [endTime, setEndTime] = useState(
    selectedSpot.end_time?.slice(11, 16) || "23:00"
  );
  const [price, setPrice] = useState<number>(selectedSpot.price || 0);

  if (!selectedSpot) return null;

  const isMineSpot = selectedSpot.renter_id === currentUserId;

  const handleUpdateSpot = async () => {
    if (startTime >= endTime) {
      alert("start time must be before end time");
      return;
    }
    const res = await fetch(
      `http://localhost:3001/parking-spots/${selectedSpot.spot_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          start_time: `${selectedDate}T${startTime}`,
          end_time: `${selectedDate}T${endTime}`,
          price,
        }),
      }
    );
    if (res.ok) {
      alert("Spot updated");
      onBooked();
    }
  };

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
    if (isMineSpot) {
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
    ? isMineSpot
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
        {selectedSpot.is_owner ? (
          <>
            <p>
              <strong>Your spot:</strong> {selectedSpot.spot_number}
            </p>
            <div className="mb-2">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleUpdateSpot}>
                Update
              </button>
            </div>
          </>
        ) : (
          <div>
            <p>
              <strong>Spot:</strong> {selectedSpot.spot_number}
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
        )}
      </div>
    </>
  );
}

export default SpotDetails;
