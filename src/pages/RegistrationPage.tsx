import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateUniqueName } from "@/lib/firestoreUtils";
import { Role, User } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  studentId: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const RegistrationPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studentId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 1. Create user in Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2. Create user document in Firestore
      try {
        const uniqueName = await generateUniqueName("users", "name", values.name);

        const newUser: User = {
          uid: user.uid,
          email: user.email!,
          name: uniqueName,
          studentId: values.studentId,
          roles: [Role.GUEST],
          projects: [],
          introduction: "Welcome! Please update your introduction.",
          imageUrl: "",
        };

        await setDoc(doc(db, "users", user.uid), newUser);

      } catch (firestoreError) {
        console.error(
          "Error creating user document in Firestore:",
          firestoreError
        );
        toast.error("Failed to create user profile. Please contact support.");
        // Delete the Firebase Auth user if Firestore document creation fails
        await deleteUser(user);
        return;
      }

      toast.success("Registration successful!");
      navigate("/mypage");
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-full py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Hong Gildong" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="202412345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;