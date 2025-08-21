import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Project {id} Details</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 text-center">
        Detailed view of a project, including team members, documents, and more.
      </p>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold">Project Title: Awesome Project {id}</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This is a detailed description of Project {id}. It showcases innovative solutions and cutting-edge technology.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Team Members:</strong> John Doe, Jane Smith, Bob Johnson
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>GitHub Repo:</strong>{" "}
          <a href="#" className="text-blue-600 hover:underline">
            github.com/awesome-project-{id}
          </a>
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>Like Project</span>
          </Button>
          <span className="text-gray-600 dark:text-gray-400"> (123 Likes)</span>
        </div>
        {/* Placeholder for documents, screenshots, etc. */}
        <h3 className="text-xl font-semibold mt-6">Additional Materials:</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li><a href="#" className="text-blue-600 hover:underline">Project Proposal.pdf</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Demo Video.mp4</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Screenshot_1.png</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;