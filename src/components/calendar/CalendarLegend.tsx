
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { useStatusHelpers } from "./StatusUtils";

const CalendarLegend = () => {
  const { language } = useTheme();
  const { getStatusText } = useStatusHelpers();
  
  const statuses = ['open', 'progress', 'seekbackup', 'found', 'closed', 'old'];
  
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-4 justify-center text-base">
        {statuses.map(status => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-status-${status}`}></div>
            <span>{getStatusText(status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
