
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from '../types/event';
import { mockUsers } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';

interface EventDetailsProps {
  event: Event;
  language: 'en' | 'de';
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  onEventClick?: (event: Event) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  language,
  getStatusText,
  getStatusColor,
  onEventClick
}) => {
  const { user } = useAuth();
  const mentor = event.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
  const isCoach = user?.role === 'coach';

  return (
    <Button
      variant="ghost"
      className="w-full p-4 h-auto rounded-lg hover:bg-accent"
      onClick={() => onEventClick?.(event)}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 w-full text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-lg">{event.company}</p>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
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
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-base bg-secondary px-3 py-1 rounded-full">
            {language === "en" ? "Column" : "Spalte"} {event.column}
          </p>
        </div>
      </div>
    </Button>
  );
};
