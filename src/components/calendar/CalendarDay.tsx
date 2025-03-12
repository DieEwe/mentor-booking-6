
import React from "react";
import { Event } from "@/types/event";

interface CalendarDayProps {
  date: Date;
  dayEvents: Event[];
  onEventClick: (event: Event) => void;
}

const CalendarDay = ({ date, dayEvents, onEventClick }: CalendarDayProps) => {
  return (
    <div className="w-full h-full min-h-[120px] p-2 border border-border/30 hover:bg-accent/20 transition-colors">
      <div className="text-base font-medium mb-2">
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
            className={`w-full text-left text-xs p-1.5 rounded-sm truncate ${
              event.status === "wanted" ? "bg-status-wanted/20 hover:bg-status-wanted/30" :
              event.status === "process" ? "bg-status-process/20 hover:bg-status-process/30" :
              "bg-status-found/20 hover:bg-status-found/30"
            }`}
          >
            {event.time} - {event.company}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;
