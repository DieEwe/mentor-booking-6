
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { mockEvents } from "../types/event";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

const Calendar = () => {
  const { language } = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {language === "en" ? "Calendar" : "Kalender"}
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="p-6 glass">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>
        <Card className="p-6 flex-1 glass">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {language === "en" ? "Events" : "Veranstaltungen"}
            </h2>
            <div className="space-y-4">
              {mockEvents
                .filter((event) => event.date === date?.toISOString().split("T")[0])
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{event.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.time} - {event.coachName}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "en" ? "Column" : "Spalte"} {event.column}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
