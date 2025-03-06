
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { HomeLog } from "@/hooks/use-home-data";

interface RecentLogsCardProps {
  recentLogs: HomeLog[];
  onAddFirstLog: () => void;
}

const RecentLogsCard = ({ recentLogs, onAddFirstLog }: RecentLogsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 border-none shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Recent Logs
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/symptom-diary")}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div 
                key={log.id} 
                className="border-l-2 border-primary/50 pl-3 py-1 hover:bg-muted/30 rounded-r-md transition-colors cursor-pointer"
                onClick={() => navigate(`/symptom-diary/${log.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.petName}</p>
                    <p className="text-sm text-muted-foreground">{log.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {log.symptoms.slice(0, 3).map((symptom, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {symptom}
                      </span>
                    ))}
                    {log.symptoms.length > 3 && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        +{log.symptoms.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2">No symptom logs yet</p>
            <Button variant="outline" size="sm" onClick={onAddFirstLog} className="mt-2">
              Add your first log
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentLogsCard;
