
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Event } from '../types/event';
import { mockUsers } from '../types/auth';

interface EventDetailsProps {
  event: Event;
  language: 'en' | 'de';
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  language,
  getStatusText,
  getStatusColor
}) => {
  // Find the mentor for this event if one exists
  const mentor = event.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-lg">{event.company}</p>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {event.time} - {event.coachName}
          </p>
          {mentor && (
            <p className="text-sm mt-1">
              {language === "en" ? "Mentor: " : "Mentor: "}
              <span className="font-medium">
                {mentor.firstName} {mentor.lastName}
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-sm bg-secondary px-3 py-1 rounded-full">
            {language === "en" ? "Column" : "Spalte"} {event.column}
          </p>
        </div>
      </div>
    </div>
  );
};
