
import { useState } from "react";
import { mockEvents, Event } from "../types/event";
import { useTheme } from "../contexts/ThemeContext";
import { useStatusHelpers } from "@/components/calendar/StatusUtils";
import EventModal from "@/components/EventModal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  ListIcon, // Renamed from List to ListIcon to avoid conflict
  Calendar as CalendarIcon, 
  Search, 
  SortAsc, 
  SortDesc,
  Filter 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const EventList = () => { // Renamed component from List to EventList
  const { language } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { getStatusText, getStatusColor } = useStatusHelpers();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Event>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredEvents = mockEvents
    .filter(event => 
      (statusFilter ? event.status === statusFilter : true) &&
      (search ? 
        event.company.toLowerCase().includes(search.toLowerCase()) ||
        event.coachName.toLowerCase().includes(search.toLowerCase()) ||
        event.date.includes(search)
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
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                {language === "en" ? "All" : "Alle"}
              </DropdownMenuItem>
              {['open', 'progress', 'seekbackup', 'found', 'closed', 'old'].map(status => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status as any).split(' ')[0]}`}></div>
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
          <Badge 
            className={getStatusColor(statusFilter as any)}
            size="lg"
          >
            {getStatusText(statusFilter)}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStatusFilter(null)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
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
                    <Badge 
                      className={getStatusColor(event.status)}
                      size="lg"
                    >
                      {getStatusText(event.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        getStatusText={getStatusText}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default EventList;
