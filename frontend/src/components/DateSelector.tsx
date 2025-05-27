import { Button } from "react-bootstrap";
type Props = {
  selectedDate: string;
  onSelect: (date: string) => void;
};
function DateSelector({ onSelect, selectedDate }: Props) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
  console.log(days);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const formatLabel = (date: Date) =>
    date.toLocaleDateString("us-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <div className="d-flex gap-2 mb-4 overflow-auto">
      {days.map((date) => {
        const value = formatDate(date);
        const label = formatLabel(date);
        const isSelected = selectedDate === value;

        return (
          <Button
            key={value}
            variant={isSelected ? "primary" : "outline-secondary"}
            onClick={() => onSelect(value)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}

export default DateSelector;
