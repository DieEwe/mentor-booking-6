
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

  // Function to get event status color
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "open":
        return "bg-status-open text-white";
      case "progress":
        return "bg-status-progress text-white";
      case "seekbackup":
        return "bg-status-seekbackup text-white";
      case "found":
        return "bg-status-found text-white";
      case "closed":
        return "bg-status-closed text-white";
      case "old":
        return "bg-status-old text-white";
      default:
        return "bg-muted";
    }
  };

  return { getStatusText, getStatusColor };
};
