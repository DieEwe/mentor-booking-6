
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mockEvents, Event } from "../types/event";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";
import { toast } from "sonner";
import { SendHorizonal } from "lucide-react";

const Events = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const isMentor = user?.role === 'mentor';

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  const handleRequestMentor = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    toast.success(
      language === "en" 
        ? "Request sent successfully" 
        : "Anfrage erfolgreich gesendet"
    );
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
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </div>
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
            {isMentor && ['open', 'progress', 'seekbackup'].includes(event.status) && (
              <Button 
                className="w-full mt-4"
                onClick={(e) => handleRequestMentor(event, e)}
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
