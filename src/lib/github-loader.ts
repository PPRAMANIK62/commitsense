import { db } from "@/server/db";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { type Document } from "@langchain/core/documents";
import { generateEmbedding, summarizeCode } from "./gemini";

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

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding) => {
      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          projectId,
          fileName: embedding.filename,
          sourceCode: embedding.sourceCode,
          summary: embedding.summary,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding"
      SET "summaryEmbedding" = ${embedding.embedding}::vector
      WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  const embeddings = await Promise.all(
    docs.map(async (doc) => {
      const summary = await summarizeCode(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        filename: doc.metadata.source,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
      };
    }),
  );
  return embeddings;
};
