
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { mockUsers } from "../types/auth";
import { User, Mail, Building, Quote, Edit, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser } = useAuth();
  const { language, theme } = useTheme();
  const [visibilityEnabled, setVisibilityEnabled] = useState(true);
  
  const user = id ? mockUsers.find(u => u.id === id) : currentUser;
  const isOwnProfile = !id || id === currentUser?.id;

  // Sample user quote and description (these would come from user data in a real app)
  const userQuote = isOwnProfile 
    ? "Helping others reach their potential is my passion."
    : "Dedicated to mentoring the next generation.";
    
  const userDescription = isOwnProfile
    ? "I'm an experienced mentor with a focus on inclusive leadership and accessibility. I've been working in this field for over 5 years and enjoy connecting with new mentees."
    : "An enthusiastic professional with expertise in their field. Known for providing practical guidance and support to mentees.";

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Profile Not Found" : "Profil nicht gefunden"}
        </h1>
      </div>
    );
  }

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-bold mb-2">
        {isOwnProfile 
          ? (language === "en" ? "My Profile" : "Mein Profil")
          : `${user.firstName} ${user.lastName}`}
      </h1>
      
      {/* Main Profile Card */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Profile Photo & Basic Info */}
        <Card className="p-6 glass md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-4xl font-bold text-primary border-4 border-primary/20">
              {getInitials()}
            </div>
            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-muted-foreground capitalize mt-1">{user.role}</p>
            
            {user.company && (
              <div className="flex items-center mt-2 gap-1 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{user.company}</span>
              </div>
            )}
            
            {isOwnProfile && (
              <div className="mt-6 w-full">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="disability-visible">
                      {language === "en" ? "Disability Visibility" : "Sichtbarkeit der Behinderung"}
                    </Label>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {visibilityEnabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      <span>{visibilityEnabled 
                        ? (language === "en" ? "Visible" : "Sichtbar") 
                        : (language === "en" ? "Hidden" : "Versteckt")}
                      </span>
                    </div>
                  </div>
                  <Switch
                    id="disability-visible"
                    checked={visibilityEnabled}
                    onCheckedChange={setVisibilityEnabled}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Right Column - Details */}
        <Card className="p-6 glass md:col-span-2">
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <User className="h-5 w-5" />
                {language === "en" ? "Contact Information" : "Kontaktinformationen"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Username" : "Benutzername"}
                  </label>
                  <p className="text-md font-medium">@{user.firstName.toLowerCase()}{user.lastName.toLowerCase()}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    {language === "en" ? "Email" : "E-Mail"}
                  </label>
                  <p className="text-md font-medium flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Quote */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Quote className="h-5 w-5" />
                {language === "en" ? "Quote" : "Zitat"}
              </h3>
              <blockquote className="pl-4 border-l-2 border-primary/30 italic text-muted-foreground">
                "{userQuote}"
              </blockquote>
            </div>
            
            <Separator />
            
            {/* Self Description */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <User className="h-5 w-5" />
                {language === "en" ? "About" : "Über mich"}
              </h3>
              <p className="text-muted-foreground">
                {userDescription}
              </p>
            </div>
            
            {isOwnProfile && (
              <div className="pt-4 flex justify-end">
                <button className="text-primary flex items-center gap-1 text-sm hover:underline">
                  <Edit className="h-3.5 w-3.5" />
                  {language === "en" ? "Edit Profile" : "Profil bearbeiten"}
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
