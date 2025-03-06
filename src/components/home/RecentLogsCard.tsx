
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { HomeLog } from "@/hooks/use-home-data";

interface RecentLogsCardProps {
  recentLogs: HomeLog[];
  onAddFirstLog: () => void;
}

const RecentLogsCard = ({ recentLogs, onAddFirstLog }: RecentLogsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Recent Logs</CardTitle>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/symptom-diary")}>
            <Calendar className="h-4 w-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="border-b pb-2 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.petName}</p>
                    <p className="text-sm text-muted-foreground">{log.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {log.symptoms.map((symptom, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No recent logs yet</p>
            <Button variant="link" onClick={onAddFirstLog}>
              Add your first log
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentLogsCard;
