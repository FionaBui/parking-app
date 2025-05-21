import { useState, useEffect } from "react";
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
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:00");
  const [price, setPrice] = useState<number>(0);
  const [rentStartTime, setRentStartTime] = useState("00:00");
  const [rentEndTime, setRentEndTime] = useState("23:00");

  useEffect(() => {
    setStartTime(selectedSpot.start_time?.slice(0, 5) || "00:00");
    setEndTime(selectedSpot.end_time?.slice(0, 5) || "23:00");
    setPrice(selectedSpot.price || 0);
  }, [selectedSpot]);

  if (!selectedSpot) return null;

  const isMineSpot = selectedSpot.renter_id === currentUserId;
  const isOwner = selectedSpot.is_owner;
  const isRented = selectedSpot.is_rented;
  const isAvailable = selectedSpot.is_available;

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
          date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          price,
        }),
      }
    );
    if (res.ok) {
      alert("Spot updated");
      onBooked();
    }
  };

  const handleCancelAvailability = async () => {
    const res = await fetch(
      `http://localhost:3001/parking-spots/${selectedSpot.spot_id}/availability?date=${selectedDate}&user=${currentUserId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      onBooked();
    }
  };

  const handleBooking = async () => {
    if (rentStartTime >= rentEndTime) {
      alert("Start time must be before end time");
      return;
    }

    if (!selectedSpot.start_time || !selectedSpot.end_time) {
      alert("This spot is not available at this time");
      return;
    }

    if (
      rentStartTime < selectedSpot.start_time.slice(0, 5) ||
      rentEndTime > selectedSpot.end_time.slice(0, 5)
    ) {
      alert(
        `❗ You can only book between ${selectedSpot.start_time.slice(
          0,
          5
        )} and ${selectedSpot.end_time.slice(0, 5)}`
      );
      return;
    }

    console.log("Sending booking:", {
      spot_id: selectedSpot.spot_id,
      renter_id: currentUserId,
      rent_date: selectedDate,
      rent_start_time: rentStartTime,
      rent_end_time: rentEndTime,
    });
    const res = await fetch("http://localhost:3001/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spot_id: selectedSpot.spot_id,
        renter_id: currentUserId,
        rent_date: selectedDate,
        rent_start_time: rentStartTime,
        rent_end_time: rentEndTime,
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

  if (isRented) {
    if (isMineSpot) {
      buttonText = "Cancel booking";
      onClick = handleCancelBooking;
    } else {
      buttonText = "Already booked";
      isDisabled = true;
    }
  } else if (!isAvailable) {
    buttonText = "Busy";
    isDisabled = true;
  }

  const statusText = isRented
    ? isMineSpot
      ? "You booked this spot"
      : "Booked"
    : isAvailable
    ? "Available"
    : isOwner
    ? "Not available"
    : "Unavailable";

  return (
    <>
      <div className="card shadow-sm" style={{ minWidth: "260px" }}>
        <h5>Detail</h5>
        {isOwner ? (
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
                disabled={isRented}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isRented}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Price (SEK/hour)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={isRented}
              />
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleUpdateSpot}
                disabled={isRented}
              >
                Update
              </button>
              {selectedSpot.is_available && (
                <button
                  className="btn btn-outline-danger"
                  onClick={handleCancelAvailability}
                  disabled={isRented}
                >
                  Cancel listing
                </button>
              )}
              {isRented && (
                <div className="alert alert-warning mt-2">
                  This spot is currently rented and cannot be cancelled.
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <p>
              <strong>Spot:</strong> {selectedSpot.spot_number}
            </p>
            <p>
              <strong>Status: </strong> {statusText}
            </p>
            <p>
              <strong>Available Time: </strong>
              {selectedSpot.start_time?.slice(0, 5)} {"- "}
              {selectedSpot.end_time?.slice(0, 5)}
            </p>
            {isAvailable && (
              <>
                <div className="mb-2">
                  <label className="form-label">Your start time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={rentStartTime}
                    onChange={(e) => setRentStartTime(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Your end time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={rentEndTime}
                    onChange={(e) => setRentEndTime(e.target.value)}
                  />
                </div>
                <p>
                  <strong>Price: </strong>
                  {selectedSpot.price}
                </p>
              </>
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
