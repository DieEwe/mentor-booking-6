
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from '../types/event';
import { mockUsers } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStatusHelpers } from '@/components/calendar/StatusUtils';
import { CalendarIcon, Clock, Building2, UserRound, Columns3, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const mentor = event?.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
  const isCoach = user?.role === 'coach';
  const isMentor = user?.role === 'mentor';
  const canRequest = isMentor && event && ['open', 'progress', 'seekbackup'].includes(event.status);

  if (!event) return null;
  
  const handleRequestMentor = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(
      language === "en" 
        ? "Request sent successfully" 
        : "Anfrage erfolgreich gesendet"
    );
  };

  return (
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
            </div>
            <div className={`px-3 py-1.5 rounded-md ${getStatusColor(event.status)}`}>
              <span className="text-sm font-medium">{getStatusText(event.status)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <p className="text-lg flex items-center gap-2">
              <UserRound className="h-5 w-5 text-muted-foreground" />
              {language === 'en' ? 'Coach:' : 'Coach:'} {event.coachName}
            </p>
            <p className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              {language === 'en' ? 'Company:' : 'Unternehmen:'} {event.company}
            </p>
            <p className="text-lg flex items-center gap-2">
              <Columns3 className="h-5 w-5 text-muted-foreground" />
              {language === 'en' ? 'Column:' : 'Spalte:'} {event.column}
            </p>
            {mentor && (
              <p className="text-lg flex items-center gap-2">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                {language === 'en' ? 'Mentor:' : 'Mentor:'}{' '}
                {isCoach ? (
                  <Link
                    to={`/profile/${mentor.id}`}
                    className="text-primary hover:underline font-medium"
                    onClick={() => onOpenChange(false)}
                  >
                    {mentor.firstName} {mentor.lastName}
                  </Link>
                ) : (
                  <span>{mentor.firstName} {mentor.lastName}</span>
                )}
              </p>
            )}
          </div>

          {canRequest && (
            <div className="pt-4 border-t">
              <Button 
                className="w-full"
                onClick={handleRequestMentor}
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
