import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to the Contest Platform!</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Discover exciting contests, showcase innovative projects, and connect with talented users.
        </p>
        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
          Request a Contest Registration
        </Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Contests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Explore ongoing and upcoming contests.</p>
            <ul className="list-disc list-inside space-y-1 text-left text-gray-700 dark:text-gray-200">
              <li>Annual Innovation Challenge</li>
              <li>Summer Code Jam</li>
              <li>Design Sprint 2024</li>
            </ul>
            <Link to="/contests">
              <Button variant="link" className="mt-4 p-0 h-auto">View All Contests</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Browse amazing projects from our community.</p>
            <ul className="list-disc list-inside space-y-1 text-left text-gray-700 dark:text-gray-200">
              <li>AI-Powered Chatbot</li>
              <li>Eco-Friendly Smart Home</li>
              <li>Interactive Data Visualization</li>
            </ul>
            <Link to="/projects">
              <Button variant="link" className="mt-4 p-0 h-auto">View All Projects</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Meet the talented individuals and teams.</p>
            <ul className="list-disc list-inside space-y-1 text-left text-gray-700 dark:text-gray-200">
              <li>Alice Johnson (Developer)</li>
              <li>Bob Smith (Designer)</li>
              <li>Team Innovate</li>
            </ul>
            <Link to="/users">
              <Button variant="link" className="mt-4 p-0 h-auto">View All Users</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;