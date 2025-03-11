
import React from "react";
import { Event } from "@/types/event";

interface CalendarDayProps {
  date: Date;
  dayEvents: Event[];
  onEventClick: (event: Event) => void;
}

const CalendarDay = ({ date, dayEvents, onEventClick }: CalendarDayProps) => {
  return (
    <div className="w-full h-full min-h-[100px] p-1">
      <div className="text-base font-medium mb-1">
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {dayEvents.map((event) => (
          <button
            key={event.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEventClick(event);
            }}
            className="w-full text-left text-xs p-1 rounded hover:bg-accent truncate"
          >
            {event.time} - {event.company}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;
