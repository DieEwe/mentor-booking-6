import { useMemo } from "react";
import { isSameDay, parseISO, format } from "date-fns";
import { Event } from "@/types/event";

export const useCalendarEvents = (events: Event[]) => {
  // Group events by date - ensure consistent date format
  const eventsByDate = useMemo(() => {
    const result: Record<string, Event[]> = {};
    
    events.forEach(event => {
      // Ensure date is in YYYY-MM-DD format
      const dateKey = typeof event.date === 'string' 
        ? event.date 
        : format(event.date, 'yyyy-MM-dd');
        
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
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateString] || [];
  };

  // Filter events by selected date
  const getEventsBySelectedDate = (selectedDate: Date): Event[] => {
    if (!selectedDate) return [];
    return events.filter((event) => {
      if (typeof event.date === 'string') {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, selectedDate);
      }
      return false;
    });
  };

  // Get event status counts for a specific date
  const getStatusCountsForDate = (date: Date) => {
    const eventsForDate = getEventsForDate(date);
    const counts: Record<string, number> = {
      open: 0,
      progress: 0,
      seekbackup: 0,
      found: 0,
      closed: 0,
      old: 0
    };
    
    eventsForDate.forEach(event => {
      counts[event.status]++;
    });
    
    return counts;
  };

  return {
    eventsByDate,
    getEventsForDate,
    getEventsBySelectedDate,
    getStatusCountsForDate
  };
};
