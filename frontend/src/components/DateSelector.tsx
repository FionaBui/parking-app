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
          <button
            key={value}
            className={`btn ${
              isSelected ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => onSelect(selectedDate)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default DateSelector;
