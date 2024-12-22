import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();
  return docs;
};

console.log(await loadGithubRepo("https://github.com/PPRAMANIK62/casecobra"));

// Output:
// Document {
//   pageContent: "import { OurFileRouter } from \"@/app/api/uploadthing/core\";\nimport { generateReactHelpers } from \"@uploadthing/react\";\n\nexport const { useUploadThing, uploadFiles } =\n  generateReactHelpers<OurFileRouter>();\n",
//   metadata: {
//     source: "src/lib/uploadthing.ts",
//     repository: "https://github.com/PPRAMANIK62/casecobra",
//     branch: "main",
//   },
//   id: undefined,
// },
