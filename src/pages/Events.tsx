
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mockEvents, Event } from "../types/event";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "../contexts/ThemeContext";
import EventModal from "@/components/EventModal";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";

const Events = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { getStatusText, getStatusColor } = useStatusHelpers();

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
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
          <Card 
            key={event.id} 
            className="p-6 glass hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium text-base">{event.company}</p>
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
              <Button 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  // Request mentor functionality would go here
                }}
              >
                {language === "en" ? "Request to Mentor" : "Anfrage als Mentor"}
              </Button>
            )}
          </Card>
        ))}
      </div>

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

export default Events;
