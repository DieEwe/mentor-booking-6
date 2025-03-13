
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { useStatusHelpers } from "./StatusUtils";

const CalendarLegend = () => {
  const { language, theme } = useTheme();
  const { getStatusText, getStatusDotColor } = useStatusHelpers();
  
  const statuses = ['open', 'progress', 'seekbackup', 'found', 'closed', 'archived'];
  
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        {statuses.map(status => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status as any)}`}></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
              {getStatusText(status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
