import { useState, useEffect } from "react";
import type { SpotStatus } from "../types";
import { Card, Button, Form, Alert } from "react-bootstrap";

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

  const durationInHours =
    parseInt(rentEndTime.slice(0, 2)) - parseInt(rentStartTime.slice(0, 2)) ||
    0;

  const totalPrice = durationInHours * selectedSpot.price;

  const isValidBookingTime =
    selectedSpot.start_time &&
    selectedSpot.end_time &&
    rentStartTime < rentEndTime &&
    rentStartTime >= selectedSpot.start_time.slice(0, 5) &&
    rentEndTime <= selectedSpot.end_time.slice(0, 5);

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
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Spot Detail</Card.Title>
        {isOwner ? (
          <>
            <p>
              <strong>Your spot:</strong> {selectedSpot.spot_number}
            </p>
            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isRented}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isRented}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="form-label">Price (SEK/hour)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={isRented}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button onClick={handleUpdateSpot} disabled={isRented}>
                Update
              </Button>
              {selectedSpot.is_available && (
                <Button
                  variant="outline-danger"
                  onClick={handleCancelAvailability}
                  disabled={isRented}
                >
                  Cancel listing
                </Button>
              )}
            </div>
            {isRented && (
              <Alert variant="warning" className="mt-2">
                This spot is currently rented and cannot be cancelled.
              </Alert>
            )}
          </>
        ) : (
          <>
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
                <Form.Group className="mb-2">
                  <Form.Label>Your start time</Form.Label>
                  <Form.Control
                    type="time"
                    value={rentStartTime}
                    onChange={(e) => setRentStartTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Your end time</Form.Label>
                  <Form.Control
                    type="time"
                    value={rentEndTime}
                    onChange={(e) => setRentEndTime(e.target.value)}
                  />
                </Form.Group>
                <p>
                  <strong>Price: </strong>
                  {selectedSpot.price} SEK/hour
                </p>
                {isValidBookingTime && (
                  <p>
                    <strong>Total price: </strong>
                    {totalPrice} SEK
                  </p>
                )}
              </>
            )}

            <Button
              className="w-100 mt-2"
              disabled={isDisabled}
              onClick={onClick}
            >
              {buttonText}
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default SpotDetails;
