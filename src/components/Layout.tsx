import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            OpenKnights
          </Link>
          <div className="space-x-4 flex items-center">
            <Link to="/contests">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Contests</Button>
            </Link>
            <Link to="/projects">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Projects</Button>
            </Link>
            <Link to="/users">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Users</Button>
            </Link>
            {currentUser ? (
              <>
                <Link to="/mypage">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">My Page</Button>
                </Link>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Login</Button>
                </Link>
                <Link to="/registration">
                  <Button variant="secondary">Register</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="p-4 text-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Layout;