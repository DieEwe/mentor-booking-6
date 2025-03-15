import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface FirstLoginModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const FirstLoginModal: React.FC<FirstLoginModalProps> = ({ isOpen, onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 8) {
      setError(language === 'en' 
        ? 'Password must be at least 8 characters' 
        : 'Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'en' 
        ? 'Passwords do not match' 
        : 'Passwörter stimmen nicht überein');
      return;
    }

    setIsLoading(true);

    try {
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // Mark first login as completed
      const { error: profileError } = await supabase
        .from('mentorbooking_profile_extensions')
        .update({ first_login_completed: true })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      toast.success(language === 'en' 
        ? 'Password set successfully!' 
        : 'Passwort erfolgreich festgelegt!');
      
      onComplete();
    } catch (error: any) {
      setError(error.message || (language === 'en' 
        ? 'Failed to update password' 
        : 'Fehler beim Aktualisieren des Passworts'));
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Create your password' : 'Erstellen Sie Ihr Passwort'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Please create a password for your account.' 
              : 'Bitte erstellen Sie ein Passwort für Ihr Konto.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="password">
              {language === 'en' ? 'Password' : 'Passwort'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'en' ? 'Create password' : 'Passwort erstellen'}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              {language === 'en' ? 'Confirm Password' : 'Passwort bestätigen'}
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={language === 'en' ? 'Confirm password' : 'Passwort bestätigen'}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Setting...' : 'Wird gespeichert...'}
                </>
              ) : (
                language === 'en' ? 'Set Password' : 'Passwort festlegen'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstLoginModal;