
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

const CalendarLegend = () => {
  const { language } = useTheme();
  
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-4 justify-center text-base">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-wanted"></div>
          <span>{language === "en" ? "Wanted" : "Gesucht"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-process"></div>
          <span>{language === "en" ? "In Process" : "In Bearbeitung"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-status-found"></div>
          <span>{language === "en" ? "Found" : "Gefunden"}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLegend;
