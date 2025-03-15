import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Event } from "../types/event";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";
import { toast } from "sonner";
import { SendHorizonal, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import ConfirmationModal from "../components/ConfirmationModal";
import { fetchCoachNames } from "../utils/coachUtils";

const Events = () => {
  const { user } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const isMentor = user?.role === 'mentor';
  const isCoach = user?.role === 'coach';
  
  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  
  // State for confirmation modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      
      try {
        const { data, error } = await supabase
          .from('mentorbooking_events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        console.log("Fetched events:", data?.length);
        
        if (data && data.length > 0) {
          // Get unique coach IDs
          const coachIds = [...new Set(data.map(event => event.coach_id))];
          
          // Fetch coach names
          const coachNames = await fetchCoachNames(coachIds);
          
          // Transform events with coach names
          const transformedEvents: Event[] = data.map(event => ({
            id: event.id,
            title: event.title || '',
            company: event.company,
            date: event.date,
            time: event.time,
            description: event.description || '',
            coach_id: event.coach_id,
            coachName: coachNames[event.coach_id] || 'Unknown',  // Use fetched coach name
            status: event.status,
            column: 0,
            requestingMentors: event.requesting_mentors || [],
            acceptedMentors: event.accepted_mentors || [],
            backupRequests: event.backup_requests || [],
            backupMentors: event.backup_mentors || []
          }));
          
          setEvents(transformedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error(
          language === "en" 
            ? "Failed to load events" 
            : "Fehler beim Laden der Veranstaltungen"
        );
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  const handleRequestMentorClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedEvent(event);
    setConfirmModalOpen(true);
  };
  
  const handleConfirmRequest = async () => {
    if (!selectedEvent) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.rpc('mentorbooking_request_to_join_event', {
        event_id: selectedEvent.id
      });
      
      if (error) throw error;
      
      toast.success(
        language === "en" 
          ? "Request sent successfully" 
          : "Anfrage erfolgreich gesendet"
      );
      
      // Close the modal
      setConfirmModalOpen(false);
      
      // Refresh data
      const { data } = await supabase
        .from('mentorbooking_events')
        .select('*')
        .eq('id', selectedEvent.id)
        .single();
        
      if (data) {
        // Update the local state
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? {
                  ...event,
                  requestingMentors: data.requesting_mentors || [],
                } 
              : event
          )
        );
      }
    } catch (error: any) {
      console.error('Error requesting to join event:', error);
      toast.error(
        language === "en" 
          ? error.message || "Failed to send request" 
          : "Fehler beim Senden der Anfrage"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    // Navigate to create event page or open modal
    // This is for future implementation
    console.log("Create event clicked");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Events" : "Veranstaltungen"}
        </h1>
        {isCoach && (
          <Button onClick={handleCreateEvent}>
            {language === "en" ? "Create Event" : "Veranstaltung erstellen"}
          </Button>
        )}
      </div>
      
      {isLoadingEvents ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p>{language === "en" ? "No events found" : "Keine Veranstaltungen gefunden"}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="p-6 glass hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold">{event.company}</h3>
                  <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </div>
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
      )}
      
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
