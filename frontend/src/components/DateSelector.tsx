import { useState } from "react";
import { Button } from "react-bootstrap";
import "../assets/CSS/DateSelector.css";

// Props-typ: vilken dag som är vald och vad som ska göras vid val
type Props = {
  selectedDate: string;
  onSelect: (date: string) => void;
};
function DateSelector({ onSelect, selectedDate }: Props) {
  // Sätter dagens datum som start
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);

  // Genererar en lista med 7 dagar från och med startDate
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  // Hjälpfunktion: konverterar datum till svenskt format
  const formatDate = (date: Date) =>
    date.toLocaleDateString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });

  // När en dag klickas, uppdatera startDate och meddela förälder
  const handleClick = (clickedDate: Date) => {
    setStartDate(clickedDate);
    onSelect(formatDate(clickedDate));
  };

  // Återställ till dagens datum
  const resetToToday = () => {
    setStartDate(today);
    onSelect(formatDate(today));
  };

  // Kontroll: är vi redan på dagens datum?
  const isAtToday = formatDate(startDate) === formatDate(today);

  return (
    <div className="date-selector-container">
      {/* Visa tillbaka-knapp bara om vi inte är på dagens datum */}
      {!isAtToday && (
        <button className="icon-button" onClick={resetToToday}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
      )}

      {/* Loopa igenom varje dag och rendera knapp */}
      {days.map((date) => {
        const value = formatDate(date);
        const isSelected = selectedDate === value;
        const isToday = formatDate(date) === formatDate(today);

        // Visa veckodag (t.ex. MON, TUE eller TODAY)
        const weekday = isToday
          ? "TODAY"
          : date
              .toLocaleDateString("en-US", {
                weekday: "short",
              })
              .toUpperCase();
        // Visa dagnummer
        const day = date.toLocaleDateString("en-US", {
          day: "2-digit",
        });
        // Visa månad
        const month = date
          .toLocaleDateString("en-US", {
            month: "short",
          })
          .toUpperCase();

        return (
          // Rendera Bootstrap-knapp för varje dag
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
