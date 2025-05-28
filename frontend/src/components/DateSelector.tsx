import { useState } from "react";
import { Button } from "react-bootstrap";
import "../assets/CSS/DateSelector.css";
type Props = {
  selectedDate: string;
  onSelect: (date: string) => void;
};
function DateSelector({ onSelect, selectedDate }: Props) {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const formatLabel = (date: Date) =>
    date.toLocaleDateString("us-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const handleClick = (clickedDate: Date) => {
    setStartDate(clickedDate);
    onSelect(formatDate(clickedDate));
  };

  const resetToToday = () => {
    setStartDate(today);
    onSelect(formatDate(today));
  };

  const isAtToday = formatDate(startDate) === formatDate(today);

  return (
    <div className="d-flex gap-2 m-4 overflow-auto justify-content-center">
      {!isAtToday && (
        <Button variant="outline-dark" onClick={resetToToday}>
          ←
        </Button>
      )}

      {days.map((date) => {
        const value = formatDate(date);
        const label = formatLabel(date);
        const isSelected = selectedDate === value;

        return (
          <Button
            key={value}
            variant={isSelected ? "primary" : "outline-secondary"}
            onClick={() => handleClick(date)}
            className="date-btn d-flex flex-column justify-content-center align-items-center"
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}

export default DateSelector;
