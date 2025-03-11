import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from "../types/event";
import { mockUsers } from "../types/auth";
import { useTheme } from "../contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const selectedDateEvents = mockEvents.filter(
    (event) => event.date === date?.toISOString().split("T")[0]
  );

  // Get status color
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

  // Get status text
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
        <Card className="p-6 glass">
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
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-lg">{event.company}</p>
                          <Badge className={getStatusColor(event.status)}>
                            {getStatusText(event.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.time} - {event.coachName}
                        </p>
                        {event.mentorId && (
                          <p className="text-sm mt-1">
                            {language === "en" ? "Mentor: " : "Mentor: "}
                            <span className="font-medium">
                              {mockUsers.find(u => u.id === event.mentorId)?.firstName} 
                              {" "}
                              {mockUsers.find(u => u.id === event.mentorId)?.lastName}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <p className="text-sm bg-secondary px-3 py-1 rounded-full">
                          {language === "en" ? "Column" : "Spalte"} {event.column}
                        </p>
                      </div>
                    </div>
                  </div>
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
