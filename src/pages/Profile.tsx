
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { mockUsers } from "../types/auth";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuth();
  const { language } = useTheme();
  
  const user = id ? mockUsers.find(u => u.id === id) : currentUser;
  const isOwnProfile = !id || id === currentUser?.id;

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Profile Not Found" : "Profil nicht gefunden"}
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {isOwnProfile 
          ? (language === "en" ? "My Profile" : "Mein Profil")
          : `${user.firstName} ${user.lastName}`}
      </h1>
      <Card className="p-6 max-w-2xl glass">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {language === "en" ? "Name" : "Name"}
            </label>
            <p className="text-lg">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {language === "en" ? "Email" : "E-Mail"}
            </label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {language === "en" ? "Role" : "Rolle"}
            </label>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
          {user.company && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {language === "en" ? "Company" : "Unternehmen"}
              </label>
              <p className="text-lg">{user.company}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
