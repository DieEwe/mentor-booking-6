
import { useTheme } from "@/contexts/ThemeContext";
import { EventStatus } from "@/types/event";

export const useStatusHelpers = () => {
  const { language, theme } = useTheme();

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
        case "archived":
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
        case "archived":
          return "Archiviert";
        default:
          return status;
      }
    }
  };

  // Professional color palette for status indicators (light/dark mode aware)
  const getStatusColor = (status: EventStatus) => {
    if (theme === 'dark') {
      switch (status) {
        case "open":
          return "bg-blue-800/50 text-blue-100 border-blue-600";
        case "progress":
          return "bg-purple-800/50 text-purple-100 border-purple-600";
        case "seekbackup":
          return "bg-amber-800/50 text-amber-100 border-amber-600";
        case "found":
          return "bg-emerald-800/50 text-emerald-100 border-emerald-600";
        case "closed":
          return "bg-gray-700/50 text-gray-100 border-gray-600";
        case "old":
        case "archived":
          return "bg-slate-700/50 text-slate-100 border-slate-600";
        default:
          return "bg-gray-700/50 text-gray-100 border-gray-600";
      }
    } else {
      switch (status) {
        case "open":
          return "bg-blue-50 text-blue-700 border-blue-200";
        case "progress":
          return "bg-purple-50 text-purple-700 border-purple-200";
        case "seekbackup":
          return "bg-amber-50 text-amber-700 border-amber-200";
        case "found":
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "closed":
          return "bg-gray-100 text-gray-700 border-gray-200";
        case "old":
        case "archived":
          return "bg-slate-100 text-slate-700 border-slate-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    }
  };

  // For calendar event indicators (more subtle)
  const getCalendarEventStyle = (status: EventStatus) => {
    if (theme === 'dark') {
      switch (status) {
        case "open":
          return "border-l-2 border-blue-400 bg-blue-900/30 calendar-event";
        case "progress":
          return "border-l-2 border-purple-400 bg-purple-900/30 calendar-event";
        case "seekbackup":
          return "border-l-2 border-amber-400 bg-amber-900/30 calendar-event";
        case "found":
          return "border-l-2 border-emerald-400 bg-emerald-900/30 calendar-event";
        case "closed":
          return "border-l-2 border-gray-400 bg-gray-800/30 calendar-event";
        case "old":
        case "archived":
          return "border-l-2 border-slate-400 bg-slate-800/30 calendar-event";
        default:
          return "border-l-2 border-gray-400 bg-gray-800/30 calendar-event";
      }
    } else {
      switch (status) {
        case "open":
          return "border-l-2 border-blue-400 bg-blue-50 calendar-event";
        case "progress":
          return "border-l-2 border-purple-400 bg-purple-50 calendar-event";
        case "seekbackup":
          return "border-l-2 border-amber-400 bg-amber-50 calendar-event";
        case "found":
          return "border-l-2 border-emerald-400 bg-emerald-50 calendar-event";
        case "closed":
          return "border-l-2 border-gray-400 bg-gray-50 calendar-event";
        case "old":
        case "archived":
          return "border-l-2 border-slate-400 bg-slate-50 calendar-event";
        default:
          return "border-l-2 border-gray-400 bg-gray-50 calendar-event";
      }
    }
  };

  // For status dots in legend and small indicators
  const getStatusDotColor = (status: EventStatus) => {
    switch (status) {
      case "open":
        return theme === 'dark' ? "bg-blue-400" : "bg-blue-400";
      case "progress":
        return theme === 'dark' ? "bg-purple-400" : "bg-purple-400";
      case "seekbackup":
        return theme === 'dark' ? "bg-amber-400" : "bg-amber-400";
      case "found":
        return theme === 'dark' ? "bg-emerald-400" : "bg-emerald-400";
      case "closed":
        return theme === 'dark' ? "bg-gray-400" : "bg-gray-400";
      case "old":
      case "archived":
        return theme === 'dark' ? "bg-slate-400" : "bg-slate-400";
      default:
        return theme === 'dark' ? "bg-gray-400" : "bg-gray-400";
    }
  };

  return { 
    getStatusText, 
    getStatusColor, 
    getCalendarEventStyle, 
    getStatusDotColor 
  };
};
