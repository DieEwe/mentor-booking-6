
import { useAuth } from "../contexts/AuthContext";
import { mockEvents } from "../types/event";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "../contexts/ThemeContext";

const Events = () => {
  const { user } = useAuth();
  const { language } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wanted":
        return "bg-status-wanted text-white";
      case "process":
        return "bg-status-process text-white";
      case "found":
        return "bg-status-found text-white";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    if (language === "en") {
      switch (status) {
        case "wanted":
          return "Mentors Wanted";
        case "process":
          return "In Process";
        case "found":
          return "Mentor Found";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "wanted":
          return "Mentoren Gesucht";
        case "process":
          return "In Bearbeitung";
        case "found":
          return "Mentor Gefunden";
        default:
          return status;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Events" : "Veranstaltungen"}
        </h1>
        {user?.role === "coach" && (
          <Button>
            {language === "en" ? "Create Event" : "Veranstaltung erstellen"}
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="p-6 glass">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium">{event.company}</p>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Coach" : "Trainer"}: {event.coachName}
                </p>
              </div>
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                {language === "en" ? "Date" : "Datum"}: {event.date}
              </p>
              <p className="text-sm">
                {language === "en" ? "Time" : "Zeit"}: {event.time}
              </p>
              <p className="text-sm">
                {language === "en" ? "Column" : "Spalte"}: {event.column}
              </p>
            </div>
            {user?.role === "mentor" && event.status === "wanted" && (
              <Button className="w-full mt-4">
                {language === "en" ? "Request to Mentor" : "Anfrage als Mentor"}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
