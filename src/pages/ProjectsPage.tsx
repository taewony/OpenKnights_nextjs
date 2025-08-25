import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Award, ClipboardList, FileText, Calendar, GitBranch } from "lucide-react";

interface Project {
  id: string;
  teamName: string;
  description: string;
  leaderName: string;
  members: string[];
  mentor: string;
  name: string;
  note: string;
  phase: string;
  term: string;
  preTotal: number;
  finalTotal: number;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsList: Project[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Project, 'id'>),
        }));
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={project.phase.includes('SUBMITTED') ? 'default' : 'outline'}>
                        {project.phase}
                    </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Team:</strong><span className="ml-2">{project.teamName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Leader:</strong><span className="ml-2">{project.leaderName}</span>
                </div>
                 <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Mentor:</strong><span className="ml-2">{project.mentor}</span>
                </div>
                <div className="flex items-start text-sm">
                  <Users className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                  <strong>Members:</strong>
                  <div className="flex flex-wrap gap-1 ml-2">
                    {project.members.map((member, index) => (
                      <Badge key={index} variant="secondary">{member}</Badge>
                    ))}
                  </div>
                </div>
                 <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Term:</strong><span className="ml-2">{project.term}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                  <strong>Note:</strong><span className="ml-2">{project.note}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/40 p-4 flex justify-around text-sm">
                 <div className="flex items-center">
                    <ClipboardList className="w-4 h-4 mr-2"/>
                    <span>Preliminary: <strong>{project.preTotal}</strong></span>
                 </div>
                 <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2"/>
                    <span>Final: <strong>{project.finalTotal}</strong></span>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No projects found.
        </p>
      )}
    </div>
  );
};

export default ProjectsPage;