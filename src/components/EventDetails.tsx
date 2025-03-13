
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from '../types/event';
import { mockUsers } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { SendHorizonal } from 'lucide-react';

interface EventDetailsProps {
  event: Event;
  language: 'en' | 'de';
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  onEventClick?: (event: Event) => void;
  onRequestMentor?: (event: Event, e: React.MouseEvent) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  language,
  getStatusText,
  getStatusColor,
  onEventClick,
  onRequestMentor
}) => {
  const { user } = useAuth();
  const mentor = event.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
  const isCoach = user?.role === 'coach';
  const isMentor = user?.role === 'mentor';
  const canRequest = isMentor && ['open', 'progress', 'seekbackup'].includes(event.status);

  return (
    <Button
      variant="ghost"
      className="w-full p-4 h-auto rounded-lg hover:bg-accent/50 transition-all text-left justify-start"
      onClick={() => onEventClick?.(event)}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-lg">{event.company}</p>
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {getStatusText(event.status)}
            </div>
          </div>
          <p className="text-base text-muted-foreground">
            {event.time} - {event.coachName}
          </p>
          {mentor && (
            <p className="text-base mt-1">
              {language === "en" ? "Mentor: " : "Mentor: "}
              {isCoach ? (
                <Link
                  to={`/profile/${mentor.id}`}
                  className="font-medium text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {mentor.firstName} {mentor.lastName}
                </Link>
              ) : (
                <span className="font-medium">
                  {mentor.firstName} {mentor.lastName}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-base bg-secondary/70 px-3 py-1 rounded-full">
            {language === "en" ? "Column" : "Spalte"} {event.column}
          </p>
          
          {canRequest && onRequestMentor && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onRequestMentor(event, e);
              }}
              className="whitespace-nowrap"
            >
              <SendHorizonal className="h-4 w-4 mr-1" />
              {language === "en" ? "Request" : "Bewerben"}
            </Button>
          )}
        </div>
      </div>
    </Button>
  );
};
