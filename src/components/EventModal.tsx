import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStatusHelpers } from '@/components/calendar/StatusUtils';
import { toast } from "sonner";
import { supabase } from '../lib/supabase'; // Add this import
import ConfirmationModal from './ConfirmationModal';
import { CalendarIcon, Clock, Building2, UserRound, Columns3, SendHorizonal } from "lucide-react";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusText?: (status: string) => string;  // Add these two props
  getStatusColor?: (status: string) => string; // to match what you're passing
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  open,
  onOpenChange,
}) => {
  const { language } = useTheme();
  const { user } = useAuth();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  
  // Add state for the confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isBackupRequest, setIsBackupRequest] = useState(false);

  // Use current user role instead of mock users
  const isCoach = user?.role === 'coach';
  const isMentor = user?.role === 'mentor';
  const canRequest = isMentor && 
    event && 
    ['open', 'progress', 'seekbackup'].includes(event.status);
  
  const canRequestBackup = isMentor &&
    event &&
    event.status === 'seekbackup';

  if (!event) return null;

  // Open confirmation modal when request button is clicked
  const handleRequestButtonClick = (isBackup: boolean = false, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBackupRequest(isBackup);
    setConfirmModalOpen(true);
  };

  // Handle confirmation from modal
  const handleConfirmRequest = async () => {
    if (!event) return;
    
    setIsRequestLoading(true);
    
    try {
      // Call the appropriate RPC function based on request type
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
      // Close the event modal too
      onOpenChange(false);
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">{event.company}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  {language === 'en' ? 'Date:' : 'Datum:'} {event.date}
                </p>
                <p className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  {language === 'en' ? 'Time:' : 'Zeit:'} {event.time}
                </p>
                <p className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  {language === 'en' ? 'Company:' : 'Unternehmen:'} {event.company}
                </p>
                <p className="text-lg flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  {language === 'en' ? 'Coach:' : 'Coach:'} {event.coachName || 'Unknown'}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              {canRequest && (
                <Button 
                  onClick={(e) => handleRequestButtonClick(false, e)}
                  disabled={isRequestLoading}
                >
                  <SendHorizonal className="h-4 w-4 mr-2" />
                  {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
                </Button>
              )}
              
              {canRequestBackup && (
                <Button 
                  variant="secondary"
                  onClick={(e) => handleRequestButtonClick(true, e)}
                  disabled={isRequestLoading}
                >
                  <Columns3 className="h-4 w-4 mr-2" />
                  {language === "en" ? "Request as Backup" : "Als Backup anfragen"}
                </Button>
              )}
              
              <Link to={`/events/${event.id}`}>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  {language === "en" ? "View Details" : "Details anzeigen"}
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ConfirmationModal
        event={event}
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmRequest}
        isBackupRequest={isBackupRequest}
        isLoading={isRequestLoading}
      />
    </>
  );
};

export default EventModal;
