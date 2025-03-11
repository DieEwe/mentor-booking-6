import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from "../types/event";
import { useTheme } from "../contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EventModal from "@/components/EventModal";
import type { Event } from "../types/event";

const Calendar = () => {
  const { language } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Function to format events date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, language === "en" ? "MMMM d, yyyy" : "d. MMMM yyyy");
  };

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

  // Function to get event status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "wanted":
        return "bg-status-wanted text-white";
      case "process":
        return "bg-status-process text-white";
      case "found":
        return "bg-status-found text-white";
      default:
        return "bg-muted";
    }
  };

  // Function to get status text with translation
  const getStatusText = (status: string) => {
    if (language === "en") {
      switch (status) {
        case "wanted":
          return "Mentors wanted";
        case "process":
          return "In process";
        case "found":
          return "Mentors found";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "wanted":
          return "Mentoren gesucht";
        case "process":
          return "In Bearbeitung";
        case "found":
          return "Mentoren gefunden";
        default:
          return status;
      }
    }
  };

  // Filter events by selected date
  const selectedDateEvents = mockEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return date ? isSameDay(eventDate, date) : false;
  });

  // Custom day rendering for the calendar to show events
  const eventsByDate = useMemo(() => {
    const events: Record<string, Event[]> = {};
    
    mockEvents.forEach(event => {
      const dateKey = event.date;
      if (events[dateKey]) {
        events[dateKey].push(event);
      } else {
        events[dateKey] = [event];
      }
    });
    
    return events;
  }, [mockEvents]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-4xl font-bold mb-8">
        {language === "en" ? "Calendar" : "Kalender"}
      </h1>
      
      <Card className="p-6 w-full glass">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            {format(currentMonth, language === "en" ? "MMMM yyyy" : "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                const prevMonth = new Date(currentMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
              aria-label={language === "en" ? "Previous month" : "Vorheriger Monat"}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                const nextMonth = new Date(currentMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
              aria-label={language === "en" ? "Next month" : "Nächster Monat"}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full rounded-md"
            showOutsideDays={true}
            modifiers={{
              hasEvent: (day) => {
                const dateString = day.toISOString().split('T')[0];
                return !!eventsByDate[dateString];
              }
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                color: 'var(--primary)',
              }
            }}
            components={{
              DayContent: ({ date }) => {
                const dateString = date.toISOString().split('T')[0];
                const dayEvents = eventsByDate[dateString] || [];
                
                return (
                  <div className="w-full h-full min-h-[100px] p-1">
                    <div className="text-base font-medium mb-1">
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event, index) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          className="w-full text-left text-xs p-1 rounded hover:bg-accent truncate"
                        >
                          {event.time} - {event.company}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
            }}
          />
        </div>
        
        <div className="mt-6">
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-4 justify-center text-base">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-wanted"></div>
              <span>{language === "en" ? "Wanted" : "Gesucht"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-process"></div>
              <span>{language === "en" ? "In Process" : "In Bearbeitung"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-found"></div>
              <span>{language === "en" ? "Found" : "Gefunden"}</span>
            </div>
          </div>
        </div>
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
