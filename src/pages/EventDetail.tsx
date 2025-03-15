import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Event } from '../types/event';
import { useStatusHelpers } from '@/components/calendar/StatusUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import ConfirmationModal from '../components/ConfirmationModal';
import { ArrowLeft, CalendarIcon, Clock, Building2, UserRound, Columns3, Calendar, SendHorizonal, Loader2 } from 'lucide-react';
import { fetchCoachNames } from "../utils/coachUtils";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useTheme();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<any>(null);
  
  // Add state for the confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isBackupRequest, setIsBackupRequest] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch event data
        const { data: eventData, error: eventError } = await supabase
          .from('mentorbooking_events')
          .select('*')
          .eq('id', id)
          .single();
          
        if (eventError) throw eventError;
        
        if (!eventData) {
          navigate('/events');
          return;
        }
        
        // Fetch coach name
        if (eventData.coach_id) {
          const coachNames = await fetchCoachNames([eventData.coach_id]);
          
          const transformedEvent: Event = {
            id: eventData.id,
            title: eventData.title || '',
            company: eventData.company,
            date: eventData.date,
            time: eventData.time,
            description: eventData.description || '',
            coach_id: eventData.coach_id,
            coachName: coachNames[eventData.coach_id] || 'Unknown', // Use fetched coach name
            status: eventData.status,
            requestingMentors: eventData.requesting_mentors || [],
            acceptedMentors: eventData.accepted_mentors || [],
            backupRequests: eventData.backup_requests || [],
            backupMentors: eventData.backup_mentors || []
          };
          
          setEvent(transformedEvent);
        }
        
        // Fetch mentor data if the event has an accepted mentor
        if (eventData.accepted_mentors && eventData.accepted_mentors.length > 0) {
          const mentorId = eventData.accepted_mentors[0];
          const { data: mentorData } = await supabase
            .from('user_profile')
            .select('username')
            .eq('user_id', mentorId)
            .single();
            
          setMentor(mentorData);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error(
          language === "en" 
            ? "Failed to load event details" 
            : "Fehler beim Laden der Veranstaltungsdetails"
        );
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, navigate, language]);

  const isCoach = user?.role === 'coach';
  const isMentor = user?.role === 'mentor';
  const canRequest = isMentor && 
    event && 
    ['open', 'progress', 'seekbackup'].includes(event.status);
  
  const canRequestBackup = isMentor &&
    event &&
    event.status === 'seekbackup';

  // Open confirmation modal when request button is clicked
  const handleRequestButtonClick = (isBackup: boolean = false) => {
    if (!event) return;
    
    setIsBackupRequest(isBackup);
    setConfirmModalOpen(true);
  };

  // Handle confirmation from modal
  const handleConfirmRequest = async () => {
    if (!event) return;
    
    setIsRequestLoading(true);
    
    try {
      // Call appropriate RPC function based on request type
      const { error } = isBackupRequest 
        ? await supabase.rpc('mentorbooking_request_backup_role', {
            event_id: event.id
          })
        : await supabase.rpc('mentorbooking_request_to_join_event', {
            event_id: event.id
          });
      
      if (error) throw error;
      
      toast.success(
        language === "en" 
          ? isBackupRequest 
            ? "Backup request sent successfully" 
            : "Request sent successfully" 
          : isBackupRequest 
            ? "Backup-Anfrage erfolgreich gesendet" 
            : "Anfrage erfolgreich gesendet"
      );
      
      // Close the modal
      setConfirmModalOpen(false);
      
      // Reload event data to reflect changes
      const { data: updatedEvent } = await supabase
        .from('mentorbooking_events')
        .select('*')
        .eq('id', event.id)
        .single();
        
      if (updatedEvent) {
        setEvent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            requestingMentors: updatedEvent.requesting_mentors || [],
            backupRequests: updatedEvent.backup_requests || [],
            status: updatedEvent.status
          };
        });
      }
    } catch (error: any) {
      toast.error(
        language === "en" 
          ? error.message || "Failed to send request" 
          : "Fehler beim Senden der Anfrage"
      );
    } finally {
      setIsRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        {language === "en" ? "Event not found" : "Veranstaltung nicht gefunden"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "en" ? "Back" : "Zurück"}
        </Button>
        <h1 className="text-3xl font-bold">{event.company}</h1>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
          {getStatusText(event.status)}
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{event.company}</h2>
              <div className="mt-1">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </div>
              </div>
            </div>
            
            {canRequest && (
              <Button 
                className="sm:self-start"
                onClick={() => handleRequestButtonClick(false)}
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
              </Button>
            )}
            
            {canRequestBackup && (
              <Button 
                variant="secondary"
                className="sm:self-start"
                onClick={() => handleRequestButtonClick(true)}
              >
                <Columns3 className="h-4 w-4 mr-2" />
                {language === "en" ? "Request as Backup" : "Als Backup anfragen"}
              </Button>
            )}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {language === "en" ? "Date & Time" : "Datum & Uhrzeit"}
                </h3>
                <p className="mt-1 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {event.date} • {event.time}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {language === "en" ? "Company" : "Unternehmen"}
                </h3>
                <p className="mt-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {event.company}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {language === "en" ? "Coach" : "Coach"}
                </h3>
                <p className="mt-1 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  {event.coachName || "Unknown"}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {language === "en" ? "Description" : "Beschreibung"}
              </h3>
              <p className="text-sm">
                {event.description || (language === "en" ? "No description provided." : "Keine Beschreibung vorhanden.")}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <ConfirmationModal
        event={event}
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmRequest}
        isBackupRequest={isBackupRequest}
        isLoading={isRequestLoading}
      />
    </div>
  );
};

export default EventDetail;
