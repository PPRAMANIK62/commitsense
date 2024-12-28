import { GoogleGenerativeAI } from "@google/generative-ai";
import { type Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummarizeContent = async (diff: string) => {
  // https:/github.com/PPRAMANIK62/my-portofolio-2/commit/{commitHash}.diff
  const prompt = [
    `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/gemini.ts b/lib/gemini.ts
index 1e7f4b3..f7b8b8e 100644
--- a/lib/gemini.ts
+++ b/lib/gemini.ts
\`\`\`
This means that \` lib/gemini.ts\` was modified in this commit. Note that this is only on example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY CONTENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerence for test files
\`\`\`
Most commits will have less comments than this example list.
The last comment does not include the file names, because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.`,
    `Please summarize the following diff file: \n\n${diff}`,
  ];

  const response = await model.generateContent(prompt);

  return response.response.text();
};

export const summarizeCode = async (doc: Document) => {
  const code = doc.pageContent.slice(0, 10000); // Limit to 10k characters
  const prompt = [
    `You are an intelligent senior software engineer who specilizes in onboarding junior software engineers onto projects.`,
    `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file
    Here is the code:
    ---
    ${code}
    ---
    Give a summary in no more 100 words of the code above.`,
  ];

  const response = await model.generateContent(prompt);
  return response.response.text();
};

export const generateEmbedding = async (summary: string) => {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });
  const result = await model.embedContent(summary);
  return result.embedding.values;
};
