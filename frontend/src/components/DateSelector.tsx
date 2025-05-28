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
        <button className="icon-button" onClick={resetToToday}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
      )}

      {days.map((date) => {
        const value = formatDate(date);
        const isSelected = selectedDate === value;
        const isToday = formatDate(date) === formatDate(today);

        const weekday = isToday
          ? "TODAY"
          : date
              .toLocaleDateString("en-US", {
                weekday: "short",
              })
              .toUpperCase();

        const day = date.toLocaleDateString("en-US", {
          day: "2-digit",
        });

        const month = date
          .toLocaleDateString("en-US", {
            month: "short",
          })
          .toUpperCase();

        return (
          <Button
            key={value}
            variant={isSelected ? "primary" : "light"}
            onClick={() => handleClick(date)}
            className="date-btn d-flex flex-column justify-content-center align-items-center mx-3"
          >
            <small className="weekday">{weekday}</small>
            <small className="date-number">{day}</small>
            <small className="month">{month}</small>
          </Button>
        );
      })}
    </div>
  );
}

export default DateSelector;
