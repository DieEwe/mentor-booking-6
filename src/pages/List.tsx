import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, EventStatus } from "../types/event"; // Add EventStatus import here
import { useTheme } from "../contexts/ThemeContext";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";
import { useAuth } from "../contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ListIcon, 
  Calendar as CalendarIcon, 
  Search, 
  SortAsc, 
  SortDesc,
  Filter,
  SendHorizonal,
  Loader2 // Add this import
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ConfirmationModal from "../components/ConfirmationModal"; // Import the confirmation modal
import { supabase } from "../lib/supabase";
import { fetchCoachNames } from "../utils/coachUtils";

const EventList = () => {
  const { language } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Event>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<EventStatus | null>(null);
  const { getStatusText, getStatusColor, getStatusDotColor } = useStatusHelpers();
  const isMentor = user?.role === 'mentor';

  // Add state for the confirmation modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  // Update this to open the confirmation modal
  const handleRequestMentorClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedEvent(event);
    setConfirmModalOpen(true);
  };
  
  // Handle confirmation from modal
  const handleConfirmRequest = async () => {
    if (!selectedEvent) return;
  
    setIsLoading(true);
  
    try {
      // Call Supabase RPC function to request joining an event
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
      
      // Refresh events data
      const { data } = await supabase
        .from('mentorbooking_events')
        .select(`
          *,
          coach:coach_id (id, user_profile(username))
        `)
        .eq('id', selectedEvent.id)
        .single();
        
      if (data) {
        // Update the event in the local state
        setEvents(prev => 
          prev.map(event => 
            event.id === selectedEvent.id 
              ? {
                  ...event,
                  requestingMentors: data.requesting_mentors || [],
                  status: data.status,
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

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      
      try {
        // Fetch events
        const { data, error } = await supabase
          .from('mentorbooking_events')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Get unique coach IDs
          const coachIds = [...new Set(data.map(event => event.coach_id))];
          
          // Fetch coach names using the utility
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
            status: event.status as EventStatus,
            requestingMentors: event.requesting_mentors || [],
            acceptedMentors: event.accepted_mentors || [],
            backupRequests: event.backup_requests || [],
            backupMentors: event.backup_mentors || [],
            column: event.column || 0
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

  const handleStatusFilterChange = (status: EventStatus | null) => {
    setStatusFilter(status);
  };

  const filteredEvents = events
    .filter(event => 
      (statusFilter ? event.status === statusFilter : true) &&
      (search ? 
        event.company.toLowerCase().includes(search.toLowerCase()) ||
        event.coachName.toLowerCase().includes(search.toLowerCase()) ||
        event.date.toString().includes(search)  // Convert to string first
      : true)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ListIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">
            {language === "en" ? "Events List" : "Veranstaltungsliste"}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === "en" ? "Search events..." : "Veranstaltungen suchen..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {language === "en" ? "Status" : "Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusFilterChange(null)}>
                {language === "en" ? "All" : "Alle"}
              </DropdownMenuItem>
              {['open', 'progress', 'seekbackup', 'found', 'closed', 'archived'].map(status => (
                <DropdownMenuItem key={status} onClick={() => handleStatusFilterChange(status as EventStatus)}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status as any)}`}></div>
                    {getStatusText(status)}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleSortDirection}
            className="flex items-center gap-1"
          >
            {sortDirection === "asc" ? 
              <SortAsc className="h-4 w-4" /> : 
              <SortDesc className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>

      {statusFilter && (
        <div className="flex items-center gap-2">
          <span>{language === "en" ? "Filtered by:" : "Gefiltert nach:"}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(statusFilter as any)}`}></div>
            <span>{getStatusText(statusFilter)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleStatusFilterChange(null)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => { setSortBy("date"); toggleSortDirection(); }}
              >
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {language === "en" ? "Date" : "Datum"}
                  {sortBy === "date" && (
                    sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => { setSortBy("time"); toggleSortDirection(); }}
              >
                {language === "en" ? "Time" : "Zeit"}
                {sortBy === "time" && (
                  sortDirection === "asc" ? <SortAsc className="h-3 w-3 inline ml-1" /> : <SortDesc className="h-3 w-3 inline ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => { setSortBy("company"); toggleSortDirection(); }}
              >
                {language === "en" ? "Company" : "Unternehmen"}
                {sortBy === "company" && (
                  sortDirection === "asc" ? <SortAsc className="h-3 w-3 inline ml-1" /> : <SortDesc className="h-3 w-3 inline ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => { setSortBy("coachName"); toggleSortDirection(); }}
              >
                {language === "en" ? "Coach" : "Coach"}
                {sortBy === "coachName" && (
                  sortDirection === "asc" ? <SortAsc className="h-3 w-3 inline ml-1" /> : <SortDesc className="h-3 w-3 inline ml-1" />
                )}
              </TableHead>
              <TableHead>{language === "en" ? "Status" : "Status"}</TableHead>
              {isMentor && <TableHead className="text-right">{language === "en" ? "Actions" : "Aktionen"}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingEvents ? (
              <TableRow>
                <TableCell colSpan={isMentor ? 6 : 5} className="h-40 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMentor ? 6 : 5} className="text-center py-8">
                  {language === "en" ? "No events found" : "Keine Veranstaltungen gefunden"}
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow 
                  key={event.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEventClick(event)}
                >
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell className="font-medium">{event.company}</TableCell>
                  <TableCell>{event.coachName}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </div>
                  </TableCell>
                  {isMentor && (
                    <TableCell className="text-right">
                      {['open', 'progress', 'seekbackup'].includes(event.status) && (
                        <Button 
                          size="sm" 
                          onClick={(e) => handleRequestMentorClick(event, e)}
                          className="ml-auto"
                        >
                          <SendHorizonal className="h-4 w-4 mr-1" />
                          {language === "en" ? "Request" : "Bewerben"}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add the confirmation modal */}
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

export default EventList;
