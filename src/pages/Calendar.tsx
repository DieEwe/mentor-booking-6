
import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from "../types/event";
import { mockUsers } from "../types/auth";
import { useTheme } from "../contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventDetails } from "@/components/EventDetails";

const Calendar = () => {
  const { language } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  // Filter events by selected date
  const selectedDateEvents = mockEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return date ? isSameDay(eventDate, date) : false;
  });

  // Custom day rendering for the calendar to show events
  const eventsByDate = useMemo(() => {
    const events: Record<string, number> = {};
    
    mockEvents.forEach(event => {
      const dateKey = event.date;
      if (events[dateKey]) {
        events[dateKey] += 1;
      } else {
        events[dateKey] = 1;
      }
    });
    
    return events;
  }, [mockEvents]);

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

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-3xl font-bold">
        {language === "en" ? "Calendar" : "Kalender"}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="p-6 glass lg:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentMonth, language === "en" ? "MMMM yyyy" : "MMMM yyyy")}
            </h2>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={previousMonth}
                aria-label={language === "en" ? "Previous month" : "Vorheriger Monat"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={nextMonth}
                aria-label={language === "en" ? "Next month" : "Nächster Monat"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md pointer-events-auto"
            showOutsideDays={true}
            modifiers={{
              hasEvent: (day) => {
                const dateString = day.toISOString().split('T')[0];
                return !!eventsByDate[dateString];
              }
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                fontWeight: 'bold',
                position: 'relative'
              }
            }}
            components={{
              DayContent: ({ date, ...props }) => {
                const dateString = date.toISOString().split('T')[0];
                const count = eventsByDate[dateString] || 0;
                
                return (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div {...props}>
                      {date.getDate()}
                    </div>
                    {count > 0 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {count > 3 ? (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                        ) : (
                          Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                            <span key={i} className="inline-block w-1 h-1 rounded-full bg-primary" />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
          
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-wanted"></div>
                <span className="text-xs">{language === "en" ? "Wanted" : "Gesucht"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-process"></div>
                <span className="text-xs">{language === "en" ? "In Process" : "In Bearbeitung"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-found"></div>
                <span className="text-xs">{language === "en" ? "Found" : "Gefunden"}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 flex-1 glass">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {date 
                ? formatEventDate(date.toISOString().split("T")[0])
                : language === "en" 
                  ? "Select a date" 
                  : "Datum auswählen"}
            </h2>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <EventDetails 
                    key={event.id} 
                    event={event} 
                    language={language} 
                    getStatusText={getStatusText}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {language === "en"
                  ? "No events scheduled for this date"
                  : "Keine Veranstaltungen für dieses Datum geplant"}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
