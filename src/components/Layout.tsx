import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Contest App
          </Link>
          <div className="space-x-4">
            <Link to="/contests">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Contests</Button>
            </Link>
            <Link to="/projects">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Projects</Button>
            </Link>
            <Link to="/users">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Users</Button>
            </Link>
            <Button variant="secondary">Request Registration</Button>
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