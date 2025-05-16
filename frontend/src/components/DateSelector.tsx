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
  const formatDate = (date: Date) =>
    date.toLocaleDateString("sv-SV", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  const formatLabel = (date: Date) =>
    date.toLocaleDateString("us-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {days.map((date) => {
        const value = formatDate(date);
        const label = formatLabel(date);
        return (
          <button key={value} onClick={() => onSelect(selectedDate)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default DateSelector;
