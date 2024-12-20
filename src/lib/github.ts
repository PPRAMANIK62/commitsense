import { db } from "@/server/db";
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = "https://github.com/PPRAMANIK62/my-portfolio-2";

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthor: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitData = async (githubUrl: string): Promise<Response[]> => {
  const { data } = await octokit.rest.repos.listCommits({
    owner: "PPRAMANIK62",
    repo: "my-portfolio-2",
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author?.date).getTime() -
      new Date(a.commit.author?.date).getTime(),
  ) as any[];

  const response: Response[] = sortedCommits
    .slice(0, 15)
    .map((commit: any) => ({
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitAuthor: commit.commit.author?.name ?? "",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date || "",
    }));

  return response;
};

export const pollCommits = async (projectId: string) => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitData = await getCommitData(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitData,
  );

  return unprocessedCommits;
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });
  if (!project) {
    throw new Error("Project not found");
  }

  return { project, githubUrl: project?.githubUrl };
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitData: Response[],
) => {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const unprocessedCommits = commitData.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
};

await pollCommits("184216e3-7321-4934-907d-9daf91d03073");
