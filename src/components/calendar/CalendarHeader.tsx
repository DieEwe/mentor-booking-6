
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader = ({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth 
}: CalendarHeaderProps) => {
  const { language } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <CalendarIcon className="h-6 w-6" />
        {format(currentMonth, language === "en" ? "MMMM yyyy" : "MMMM yyyy")}
      </h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPreviousMonth}
          aria-label={language === "en" ? "Previous month" : "Vorheriger Monat"}
          className="rounded-full transition-all hover:bg-primary/10 hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNextMonth}
          aria-label={language === "en" ? "Next month" : "Nächster Monat"}
          className="rounded-full transition-all hover:bg-primary/10 hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
