import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Card } from "@/components/ui/card";
import { mockEvents } from "../types/event";
import { useTheme } from "../contexts/ThemeContext";
import EventModal from "@/components/EventModal";
import type { Event } from "../types/event";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarLegend from "@/components/calendar/CalendarLegend";
import { useCalendarEvents } from "@/components/calendar/useCalendarEvents";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Calendar = () => {
  const { language } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { eventsByDate, getEventsBySelectedDate } = useCalendarEvents(mockEvents);
  const { getStatusText, getCalendarEventStyle } = useStatusHelpers();

  const previousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: Event, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2021, 0, i + 1);
    return format(date, language === "en" ? "EEE" : "EEE");
  });

  const selectedDateEvents = getEventsBySelectedDate(selectedDate);

  return (
    <div className="space-y-6 w-full fade-in">
      <h1 className="text-4xl font-bold mb-8">
        {language === "en" ? "Calendar" : "Kalender"}
      </h1>
      
      <Card className="p-6 w-full glass">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            {format(currentMonth, language === "en" ? "MMMM yyyy" : "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={previousMonth}
              aria-label={language === "en" ? "Previous month" : "Vorheriger Monat"}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth}
              aria-label={language === "en" ? "Next month" : "Nächster Monat"}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="w-full mb-6">
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((day, i) => (
              <div 
                key={i} 
                className="text-center font-semibold py-2 text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 auto-rows-fr">
            {daysInMonth.map((day) => {
              const dateString = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDate[dateString] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              
              return (
                <div
                  key={dateString}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[120px] p-2 border rounded-md transition-colors cursor-pointer ${
                    !isCurrentMonth ? "opacity-40 bg-muted/30" : 
                    isSelected ? "border-primary bg-primary/10" : 
                    isTodayDate ? "border-accent-foreground bg-accent/30" : "hover:bg-accent/20"
                  }`}
                >
                  <div className={`text-right font-medium mb-2 ${
                    isTodayDate ? "text-primary font-bold" : ""
                  }`}>
                    {format(day, "d")}
                  </div>
                  
                  <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={(e) => handleEventClick(event, e)}
                        className={`w-full text-left text-xs p-1.5 rounded-sm truncate ${getCalendarEventStyle(event.status)}`}
                      >
                        {event.time} - {event.company}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <CalendarLegend />
      </Card>

      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        getStatusText={getStatusText}
        getStatusColor={getCalendarEventStyle}
      />
    </div>
  );
};

export default Calendar;
