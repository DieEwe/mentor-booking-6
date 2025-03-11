
import { useTheme } from "@/contexts/ThemeContext";

export const useStatusHelpers = () => {
  const { language } = useTheme();

  // Function to get status text with translation
  const getStatusText = (status: string) => {
    if (language === "en") {
      switch (status) {
        case "wanted":
          return "Mentors wanted";
        case "process":
          return "In process";
        case "found":
          return "Mentors found";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "wanted":
          return "Mentoren gesucht";
        case "process":
          return "In Bearbeitung";
        case "found":
          return "Mentoren gefunden";
        default:
          return status;
      }
    }
  };

  // Function to get event status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "wanted":
        return "bg-status-wanted text-white";
      case "process":
        return "bg-status-process text-white";
      case "found":
        return "bg-status-found text-white";
      default:
        return "bg-muted";
    }
  };

  return { getStatusText, getStatusColor };
};
