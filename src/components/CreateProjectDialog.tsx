import React, { useState, useEffect } from "react";
import { collection, getDocs, writeBatch, doc, arrayUnion, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { generateUniqueName } from "@/lib/firestoreUtils";
import { Project, Phase, Contest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void; // Callback to refresh project list or similar
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  teamName: z.string().min(2, { message: "Team name must be at least 2 characters." }),
  leaderName: z.string().min(1, { message: "Leader name cannot be empty." }),
  members: z.string().optional(),
  term: z.string().min(1, { message: "Please select a contest term." }),
  description: z.string().optional(),
});

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ isOpen, onOpenChange, onProjectCreated }) => {
  const { userProfile, currentUser } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);

  console.log("CreateProjectDialog - userProfile:", userProfile);
  console.log("CreateProjectDialog - currentUser:", currentUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      teamName: userProfile?.name || "",
      leaderName: userProfile?.name || "",
      members: "", // Changed to blank
      term: "",
      description: "",
    },
  });

  console.log("CreateProjectDialog - form defaultValues:", form.formState.defaultValues);

  useEffect(() => {
    console.log("CreateProjectDialog useEffect - userProfile changed:", userProfile);
    if (userProfile) {
      form.reset({ ...form.getValues(), leaderName: userProfile.name, members: "" }); // Changed members to blank
    }
  }, [userProfile, form]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        console.log("Fetching contests. Phase.FINISHED:", Phase.FINISHED);
        const q = query(collection(db, "contests"), where("phase", "!=", Phase.FINISHED));
        const querySnapshot = await getDocs(q);
        const contestsList: Contest[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Contest, 'id'>)
        }));
        setContests(contestsList);
        console.log("Fetched contests (filtered):", contestsList);
      } catch (error) {
        console.error("Error fetching contests:", error);
        toast.error("Failed to load contests.");
      }
    };
    fetchContests();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || !userProfile) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    try {
      const uniqueName = await generateUniqueName("projects", "name", values.name);

      const newProject: Omit<Project, 'id'> = {
        ...values,
        name: uniqueName,
        leaderName: values.leaderName,
        members: values.members ? values.members.split(',').map(m => m.trim()) : [],
        phase: Phase.REGISTERED,
      };

      const batch = writeBatch(db);

      // 1. Create the new project document
      const projectRef = doc(collection(db, "projects"));
      batch.set(projectRef, newProject);

      // 2. Update the user's document
      const userRef = doc(db, "users", currentUser.uid);
      batch.update(userRef, { projects: arrayUnion(uniqueName) });

      await batch.commit();

      toast.success(`Project "${uniqueName}" created successfully!`);
      form.reset();
      onOpenChange(false); // Close dialog
      onProjectCreated(); // Notify parent to refresh

    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Awesome New App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The A-Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leaderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leader Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Member1, Member2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contest Term</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contests.map((contest) => (
                        <SelectItem key={contest.id} value={contest.term}>
                          {contest.term} - {contest.description || "No description"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of your project." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;