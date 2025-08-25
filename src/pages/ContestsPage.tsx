import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react"; // Using Users icon for staff

interface Contest {
  id: string; // Document ID from Firestore
  description: string;
  phase: string;
  staff: string[];
  term: string;
}

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "contests"));
        const contestsList: Contest[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Contest, 'id'>),
        }));
        setContests(contestsList);
      } catch (error) {
        console.error("Error fetching contests: ", error);
        // Optionally, show a toast message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contests</h1>
      {contests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {contests.map((contest) => (
            <Card key={contest.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{contest.term}</CardTitle>
                    <CardDescription className="mt-1">{contest.description}</CardDescription>
                  </div>
                  <Badge variant={contest.phase === 'PLANED' ? 'outline' : 'default'}>
                    {contest.phase}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Staff</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {contest.staff.map((staffMember, index) => (
                    <Badge key={index} variant="secondary">
                      {staffMember}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No contests found.
        </p>
      )}
    </div>
  );
};

export default ContestsPage;