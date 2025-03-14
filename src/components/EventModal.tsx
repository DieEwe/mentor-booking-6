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
import { mockUsers } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStatusHelpers } from '@/components/calendar/StatusUtils';
import { toast } from "sonner";
import ConfirmationModal from './ConfirmationModal'; // Import the confirmation modal
import { CalendarIcon, Clock, Building2, UserRound, Columns3, SendHorizonal } from "lucide-react";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
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

  const mentor = event?.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
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
    setIsRequestLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Mock success scenario
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
      // Optionally close the event modal too
      onOpenChange(false);
    } catch (error) {
      toast.error(
        language === "en" 
          ? "Failed to send request" 
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
                {/* More event details... */}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              {canRequest && (
                <Button 
                  onClick={(e) => handleRequestButtonClick(false, e)}
                >
                  <SendHorizonal className="h-4 w-4 mr-2" />
                  {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
                </Button>
              )}
              
              {canRequestBackup && (
                <Button 
                  variant="secondary"
                  onClick={(e) => handleRequestButtonClick(true, e)}
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
      
      {/* Add the confirmation modal */}
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
