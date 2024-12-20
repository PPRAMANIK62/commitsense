import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();

  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string>(
    "commitsense-projectId",
    "",
  );
  const project = projects?.find((p) => p.id === selectedProjectId);

  return { projects, project, selectedProjectId, setSelectedProjectId };
};

export default useProject;
