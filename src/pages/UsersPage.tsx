import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name?: string;
  introduction?: string;
  imageUrl?: string;
}

const EditProfileDialog: React.FC<{ user: UserProfile; onUpdate: (updatedUser: UserProfile) => void }> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [introduction, setIntroduction] = useState(user.introduction || "");
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");

  const handleSave = async () => {
    const userDocRef = doc(db, "users", user.id);
    const updatedData = { name, introduction, imageUrl };

    try {
      await updateDoc(userDocRef, updatedData);
      onUpdate({ ...user, ...updatedData });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="imageUrl" className="text-right">
            Image URL
          </Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="introduction" className="text-right">
            Introduction
          </Label>
          <Textarea id="introduction" value={introduction} onChange={(e) => setIntroduction(e.target.value)} className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};


const UsersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: UserProfile[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Registered Users</h1>
      {users.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex flex-row items-start p-4 gap-4">
                <Avatar className="w-16 h-16 rounded-full">
                  <AvatarImage src={user.imageUrl} alt={user.name || 'User'} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-grow">
                  <CardTitle className="mb-1">{user.name || "No name provided"}</CardTitle>
                  <p className="text-sm text-muted-foreground flex-grow mb-4">
                    {user.introduction || "No introduction provided."}
                  </p>
                  {currentUser?.uid === user.id && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="self-end">Edit</Button>
                      </DialogTrigger>
                      <EditProfileDialog user={user} onUpdate={handleUserUpdate} />
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No users found.
        </p>
      )}
    </div>
  );
};

export default UsersPage;