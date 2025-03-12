
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { mockEvents } from "../types/event";
import { useTheme } from "../contexts/ThemeContext";
import EventModal from "@/components/EventModal";
import type { Event } from "../types/event";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarLegend from "@/components/calendar/CalendarLegend";
import CalendarDay from "@/components/calendar/CalendarDay";
import { useCalendarEvents } from "@/components/calendar/useCalendarEvents";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";

const Calendar = () => {
  const { language } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { eventsByDate, getEventsBySelectedDate } = useCalendarEvents(mockEvents);
  const { getStatusText, getStatusColor } = useStatusHelpers();

  // Handle month navigation
  const previousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const nextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Selected date events
  const selectedDateEvents = getEventsBySelectedDate(date);

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-4xl font-bold mb-8">
        {language === "en" ? "Calendar" : "Kalender"}
      </h1>
      
      <Card className="p-6 w-full glass">
        <CalendarHeader 
          currentMonth={currentMonth}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />
        
        <div className="w-full">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full rounded-md text-lg"
            showOutsideDays={true}
            components={{
              DayContent: ({ date }) => {
                const dateString = date.toISOString().split('T')[0];
                const dayEvents = eventsByDate[dateString] || [];
                
                return (
                  <CalendarDay 
                    date={date}
                    dayEvents={dayEvents}
                    onEventClick={handleEventClick}
                  />
                );
              }
            }}
          />
        </div>
        
        <CalendarLegend />
      </Card>

      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        getStatusText={getStatusText}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default Calendar;
