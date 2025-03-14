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
import ConfirmationModal from "../components/ConfirmationModal"; // Import the confirmation modal

const Events = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const isMentor = user?.role === 'mentor';
  
  // Add state for the confirmation modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  // Update this to open the confirmation modal instead of immediately showing toast
  const handleRequestMentorClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedEvent(event);
    setConfirmModalOpen(true);
  };
  
  // This function will be called when the mentor confirms in the modal
  const handleConfirmRequest = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Mock success scenario
      toast.success(
        language === "en" 
          ? "Request sent successfully" 
          : "Anfrage erfolgreich gesendet"
      );
      
      // Close the modal
      setConfirmModalOpen(false);
      
      // In a real app, you might want to update the UI to reflect the change
      // For example, changing the button state or refreshing the event list
    } catch (error) {
      toast.error(
        language === "en" 
          ? "Failed to send request" 
          : "Fehler beim Senden der Anfrage"
      );
    } finally {
      setIsLoading(false);
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
                onClick={(e) => handleRequestMentorClick(event, e)}
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
              </Button>
            )}
          </Card>
        ))}
      </div>
      
      {/* Add the confirmation modal */}
      <ConfirmationModal
        event={selectedEvent}
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmRequest}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Events;
