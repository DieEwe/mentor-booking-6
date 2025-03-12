
import { useTheme } from "@/contexts/ThemeContext";
import { EventStatus } from "@/types/event";

export const useStatusHelpers = () => {
  const { language } = useTheme();

  // Function to get status text with translation
  const getStatusText = (status: string) => {
    if (language === "en") {
      switch (status) {
        case "open":
          return "Open";
        case "progress":
          return "In Progress";
        case "seekbackup":
          return "Seeking Backup";
        case "found":
          return "Mentors Found";
        case "closed":
          return "Closed";
        case "old":
          return "Archived";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "open":
          return "Offen";
        case "progress":
          return "In Bearbeitung";
        case "seekbackup":
          return "Ersatz gesucht";
        case "found":
          return "Mentoren gefunden";
        case "closed":
          return "Abgeschlossen";
        case "old":
          return "Archiviert";
        default:
          return status;
      }
    }
  };

  // Professional color palette for status indicators
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "progress":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "seekbackup":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "found":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "old":
        return "bg-slate-100 text-slate-600 border-slate-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // For calendar event indicators (more subtle)
  const getCalendarEventStyle = (status: EventStatus) => {
    switch (status) {
      case "open":
        return "border-l-2 border-blue-400 bg-blue-50";
      case "progress":
        return "border-l-2 border-purple-400 bg-purple-50";
      case "seekbackup":
        return "border-l-2 border-amber-400 bg-amber-50";
      case "found":
        return "border-l-2 border-emerald-400 bg-emerald-50";
      case "closed":
        return "border-l-2 border-gray-400 bg-gray-50";
      case "old":
        return "border-l-2 border-slate-400 bg-slate-50";
      default:
        return "border-l-2 border-gray-400 bg-gray-50";
    }
  };

  // For status dots in legend and small indicators
  const getStatusDotColor = (status: EventStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-400";
      case "progress":
        return "bg-purple-400";
      case "seekbackup":
        return "bg-amber-400";
      case "found":
        return "bg-emerald-400";
      case "closed":
        return "bg-gray-400";
      case "old":
        return "bg-slate-400";
      default:
        return "bg-gray-400";
    }
  };

  return { 
    getStatusText, 
    getStatusColor, 
    getCalendarEventStyle, 
    getStatusDotColor 
  };
};
