export const TIME_SLOTS = ["09:00", "11:30", "14:00", "16:30", "19:00"];

interface Props {
  selectedDate: string;
  selectedSlot: string;
  isSlotBooked: (date: string, time: string) => boolean;
  onSelect: (slot: string) => void;
}

export function TimeSlotPicker({ selectedDate, selectedSlot, isSlotBooked, onSelect }: Props) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
        Available Daily Time Windows (5 Slots)
      </label>
      <div className="grid grid-cols-1 gap-2">
        {TIME_SLOTS.map((slot) => {
          const booked = isSlotBooked(selectedDate, slot);
          const selected = selectedSlot === slot;

          return (
            <button
              key={slot}
              type="button"
              disabled={booked}
              onClick={() => onSelect(slot)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                booked
                  ? "bg-red-50/50 border-red-200 text-red-400 cursor-not-allowed"
                  : selected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-100"
                  : "bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50/20"
              }`}
            >
              <span className="font-mono">
                {slot} {parseInt(slot) >= 12 ? "PM" : "AM"}
              </span>
              <span
                className={`text-xs font-black uppercase ${
                  booked ? "text-red-500" : selected ? "text-indigo-100" : "text-emerald-600"
                }`}
              >
                {booked ? "🚫 Not Available" : selected ? "🎯 Selected" : "🟢 Available"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}