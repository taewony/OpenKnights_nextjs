import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { User as FirebaseUser } from "firebase/auth";
import { User, Role } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

const MyPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async (user: FirebaseUser) => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as User);
        } else {
          setError("No user data found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData(currentUser);
    } else {
      setLoading(false);
      setError("No authenticated user.");
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p>User data not available.</p>
      </div>
    );
  }

  const isAdmin = userData.roles.includes(Role.ADMIN);

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 rounded-full mb-4">
              <AvatarImage src={userData.imageUrl} alt={userData.name || 'User'} />
              <AvatarFallback>
                <UserIcon className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
            {isAdmin && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mt-2 font-bold">
                ADMIN
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email:</p>
              <p className="text-base font-medium">{userData.email}</p>
            </div>
            {userData.studentId && (
              <div>
                <p className="text-sm text-muted-foreground">Student ID:</p>
                <p className="text-base font-medium">{userData.studentId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Roles:</p>
              <p className="text-base font-medium">{userData.roles.join(', ')}</p>
            </div>
            {userData.projects && userData.projects.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Projects:</p>
                <p className="text-base font-medium">{userData.projects.join(', ')}</p>
              </div>
            )}
          </div>

          {userData.introduction && (
            <div>
              <p className="text-sm text-muted-foreground">Introduction:</p>
              <p className="text-base font-medium">{userData.introduction}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPage;