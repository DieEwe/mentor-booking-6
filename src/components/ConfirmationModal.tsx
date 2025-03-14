import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from '../types/event';
import { useTheme } from '../contexts/ThemeContext';

interface ConfirmationModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isBackupRequest?: boolean;
  isLoading?: boolean;
}

/**
 * A reusable confirmation modal component for mentor request actions
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  event,
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isBackupRequest = false,
  isLoading = false,
}) => {
  const { language } = useTheme();

  // Don't render if no event is selected
  if (!event) return null;

  // Generate default texts based on language and request type
  const defaultTitle = isBackupRequest
    ? (language === "en" ? "Confirm Backup Request" : "Backup-Anfrage bestätigen")
    : (language === "en" ? "Confirm Mentoring Request" : "Mentoring-Anfrage bestätigen");

  const defaultDescription = isBackupRequest
    ? (language === "en" 
        ? `Are you sure you want to request to be a backup mentor for ${event.company}?` 
        : `Sind Sie sicher, dass Sie sich als Backup-Mentor für ${event.company} bewerben möchten?`)
    : (language === "en" 
        ? `Are you sure you want to request to mentor at ${event.company}?` 
        : `Sind Sie sicher, dass Sie als Mentor bei ${event.company} tätig sein möchten?`);

  const defaultConfirmText = language === "en" ? "Confirm Request" : "Anfrage bestätigen";
  const defaultCancelText = language === "en" ? "Cancel" : "Abbrechen";

  // Handle confirmation with loading state
  const handleConfirm = async () => {
    await onConfirm();
    // Modal will close automatically if onConfirm changes the open state
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || defaultTitle}</DialogTitle>
          <DialogDescription className="py-3">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        
        {/* Event details */}
        <div className="py-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "en" ? "Company:" : "Unternehmen:"}
            </span>
            <span className="font-medium">{event.company}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "en" ? "Date:" : "Datum:"}
            </span>
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === "en" ? "Time:" : "Zeit:"}
            </span>
            <span className="font-medium">{event.time}</span>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isLoading}
          >
            {cancelText || defaultCancelText}
          </Button>
          <Button 
            variant="default" 
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && (
              <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText || defaultConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;