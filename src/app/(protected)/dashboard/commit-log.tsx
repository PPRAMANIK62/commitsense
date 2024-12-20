"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";

const CommitLog = () => {
  const { selectedProjectId } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: selectedProjectId,
  });

  return <pre>{JSON.stringify(commits, null, 2)}</pre>;
};

export default CommitLog;
