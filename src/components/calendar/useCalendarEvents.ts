
import { useMemo } from "react";
import { isSameDay } from "date-fns";
import { Event } from "@/types/event";

export const useCalendarEvents = (events: Event[]) => {
  // Group events by date
  const eventsByDate = useMemo(() => {
    const result: Record<string, Event[]> = {};
    
    events.forEach(event => {
      const dateKey = event.date;
      if (result[dateKey]) {
        result[dateKey].push(event);
      } else {
        result[dateKey] = [event];
      }
    });
    
    return result;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): Event[] => {
    const dateString = date.toISOString().split('T')[0];
    return eventsByDate[dateString] || [];
  };

  // Filter events by selected date
  const getEventsBySelectedDate = (selectedDate: Date | undefined): Event[] => {
    if (!selectedDate) return [];
    
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return selectedDate ? isSameDay(eventDate, selectedDate) : false;
    });
  };

  return {
    eventsByDate,
    getEventsForDate,
    getEventsBySelectedDate
  };
};
