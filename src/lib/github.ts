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

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
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

console.log(await getCommitHashes(githubUrl));
