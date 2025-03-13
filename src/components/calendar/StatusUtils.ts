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

  // IMPROVED: Professional color palette for status indicators (light/dark mode aware)
  const getStatusColor = (status: EventStatus) => {
    if (theme === 'dark') {
      switch (status) {
        case "open":
          return "bg-blue-900/50 text-blue-200 border border-blue-600";
        case "progress":
          return "bg-purple-900/50 text-purple-200 border border-purple-600";
        case "seekbackup":
          return "bg-amber-900/50 text-amber-200 border border-amber-600";
        case "found":
          return "bg-emerald-900/50 text-emerald-200 border border-emerald-600";
        case "closed":
          return "bg-gray-800/50 text-gray-200 border border-gray-600";
        case "old":
        case "archived":
          return "bg-slate-800/50 text-slate-200 border border-slate-600";
        default:
          return "bg-gray-800/50 text-gray-200 border border-gray-600";
      }
    } else {
      switch (status) {
        case "open":
          return "bg-blue-50 text-blue-800 border border-blue-300 shadow-sm";
        case "progress":
          return "bg-purple-50 text-purple-800 border border-purple-300 shadow-sm";
        case "seekbackup":
          return "bg-amber-50 text-amber-800 border border-amber-300 shadow-sm";
        case "found":
          return "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm";
        case "closed":
          return "bg-gray-100 text-gray-800 border border-gray-300 shadow-sm";
        case "old":
        case "archived":
          return "bg-slate-100 text-slate-800 border border-slate-300 shadow-sm";
        default:
          return "bg-gray-100 text-gray-800 border border-gray-300 shadow-sm";
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

  // IMPROVED: For status dots in legend and small indicators with better contrast
  const getStatusDotColor = (status: EventStatus) => {
    switch (status) {
      case "open":
        return theme === 'dark' ? "bg-blue-500" : "bg-blue-500";
      case "progress":
        return theme === 'dark' ? "bg-purple-500" : "bg-purple-500";
      case "seekbackup":
        return theme === 'dark' ? "bg-amber-500" : "bg-amber-500";
      case "found":
        return theme === 'dark' ? "bg-emerald-500" : "bg-emerald-500";
      case "closed":
        return theme === 'dark' ? "bg-gray-500" : "bg-gray-500";
      case "old":
      case "archived":
        return theme === 'dark' ? "bg-slate-500" : "bg-slate-500";
      default:
        return theme === 'dark' ? "bg-gray-500" : "bg-gray-500";
    }
  };

  return { 
    getStatusText, 
    getStatusColor, 
    getCalendarEventStyle, 
    getStatusDotColor 
  };
};
