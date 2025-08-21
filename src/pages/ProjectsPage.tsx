import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProjectsPage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">All Projects</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        Browse all the amazing projects submitted to our contests.
      </p>
      <div className="space-y-4 flex flex-col items-center">
        <Link to="/projects/123">
          <Button variant="outline">View Project Example 1</Button>
        </Link>
        <Link to="/projects/456">
          <Button variant="outline">View Project Example 2</Button>
        </Link>
      </div>
      {/* Future content for project listings */}
    </div>
  );
};

export default ProjectsPage;