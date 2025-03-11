
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Event } from '../types/event';
import { mockUsers } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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
  getStatusText,
  getStatusColor,
}) => {
  const { language } = useTheme();
  const { user } = useAuth();
  const mentor = event?.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
  const isCoach = user?.role === 'coach';

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{event.company}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-lg">
                {language === 'en' ? 'Date:' : 'Datum:'} {event.date}
              </p>
              <p className="text-lg">
                {language === 'en' ? 'Time:' : 'Zeit:'} {event.time}
              </p>
            </div>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-lg">
              {language === 'en' ? 'Coach:' : 'Coach:'} {event.coachName}
            </p>
            <p className="text-lg">
              {language === 'en' ? 'Column:' : 'Spalte:'} {event.column}
            </p>
            {mentor && (
              <p className="text-lg">
                {language === 'en' ? 'Mentor:' : 'Mentor:'}{' '}
                {isCoach ? (
                  <Link
                    to={`/profile/${mentor.id}`}
                    className="text-primary hover:underline"
                  >
                    {mentor.firstName} {mentor.lastName}
                  </Link>
                ) : (
                  <span>{mentor.firstName} {mentor.lastName}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
