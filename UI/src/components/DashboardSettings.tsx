import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardSettings = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="max-w-2xl space-y-8 align-center mx-auto py-12">
      {/* Profile Section */}
      <section className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="src/assets/walter white.jpg" alt="Sophia Carter" />
          <AvatarFallback className="bg-primary text-primary-foreground text-4xl">WW</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-bold">Walter White</h2>
        <p className="text-muted-foreground">Blockchain ID: 0x3c2c5f4c50f78b0f1890</p>
        <p className="text-muted-foreground">Balance: $5,000</p>
        
        <div className="flex gap-4 mt-6 justify-center">
          <Button size="lg">Send</Button>
          <Button size="lg" variant="default" onClick={() => setShowDialog(true)}>Receive Funds</Button>
          <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
        </div>
      </section>

      {/* Account Information */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">breaking.bad@gmail.com</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Phone Number</div>
                  <div className="text-sm text-muted-foreground">*******234</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Donor ID</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    Donor ID: 0x3c2c5f4c50f78b0f18909030455687
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Privacy</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Manage Data Sharing</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Privacy Policy</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* App Preferences */}
      <section>
        <h3 className="text-xl font-semibold mb-4">App Preferences</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Language</div>
                <div className="text-muted-foreground">English</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Theme</div>
                <div className="text-muted-foreground">Light</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardSettings;