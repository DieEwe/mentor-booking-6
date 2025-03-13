
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockEvents, Event } from '../types/event';
import { mockUsers } from '../types/auth';
import { useStatusHelpers } from '@/components/calendar/StatusUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, CalendarIcon, Clock, Building2, UserRound, Columns3, Calendar } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useTheme();
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from API
    const foundEvent = mockEvents.find((e) => e.id === id);
    setEvent(foundEvent || null);
    setLoading(false);
  }, [id]);

  const mentor = event?.mentorId ? mockUsers.find(u => u.id === event.mentorId) : null;
  const isCoach = user?.role === 'coach';
  const isMentor = user?.role === 'mentor';
  const canRequest = isMentor && 
    event && 
    ['open', 'progress', 'seekbackup'].includes(event.status);

  const handleRequestMentor = () => {
    toast.success(
      language === "en" 
        ? "Request sent successfully" 
        : "Anfrage erfolgreich gesendet"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">
          {language === "en" ? "Loading..." : "Wird geladen..."}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "en" ? "Back" : "Zurück"}
          </Button>
        </div>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {language === "en" ? "Event Not Found" : "Veranstaltung nicht gefunden"}
          </h2>
          <p className="mb-6">
            {language === "en" 
              ? "The event you're looking for doesn't exist or has been removed." 
              : "Die gesuchte Veranstaltung existiert nicht oder wurde entfernt."}
          </p>
          <Button onClick={() => navigate('/events')}>
            {language === "en" ? "Go to Events" : "Zu den Veranstaltungen"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "en" ? "Back" : "Zurück"}
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h1 className="text-3xl font-bold">
            {language === "en" ? "Event Details" : "Veranstaltungsdetails"}
          </h1>
        </div>
      </div>

      <Card className="overflow-hidden">
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
                onClick={handleRequestMentor}
              >
                {language === "en" ? "Request to Mentor" : "Als Mentor bewerben"}
              </Button>
            )}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Date" : "Datum"}
                  </p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Time" : "Zeit"}
                  </p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Company" : "Unternehmen"}
                  </p>
                  <p className="font-medium">{event.company}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Coach" : "Coach"}
                  </p>
                  <p className="font-medium">{event.coachName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Columns3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "Column" : "Spalte"}
                  </p>
                  <p className="font-medium">{event.column}</p>
                </div>
              </div>
              
              {mentor && (
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Mentor" : "Mentor"}
                    </p>
                    <p className="font-medium">
                      {isCoach ? (
                        <Link
                          to={`/profile/${mentor.id}`}
                          className="text-primary hover:underline"
                        >
                          {mentor.firstName} {mentor.lastName}
                        </Link>
                      ) : (
                        <span>
                          {mentor.firstName} {mentor.lastName}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventDetail;
