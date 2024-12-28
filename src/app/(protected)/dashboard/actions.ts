"use server";

import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askQuestion = async (question: string, projectId: string) => {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
  SELECT "fileName", "sourceCode", "summary",
  1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
  FROM "SourceCodeEmbedding"
  WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
  AND "projectId" = ${projectId}
  ORDER BY similarity DESC
  LIMIT 10
  `) as { fileName: string; sourceCode: string; summary: string }[];
  console.log(result);

  let context = "";
  for (const { fileName, sourceCode, summary } of result) {
    context += `source: ${fileName}\ncode content: ${sourceCode}\nsummary of file: ${summary}\n\n`;
  }

  const prompt = `You are an ai code assistant who answers questions about the codebase. Your target audience is technical interns who are new to the codebase.
  AI assistant is a brand new, powerful, human-like artificial intelligence.
  The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
  AI is well-behaved and well-mannered individual.
  AI has a sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in the given context.
  If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions.
  START CONTEXT BLOCK
  ${context}
  END CONTEXT BLOCK

  START QUESTION
  ${question}
  END QUESTION

  AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
  If the context does not provide the answer to the question, then AI assistant will say, "I'm sorry, I don't have the answer to that question."
  AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
  AI assistant will not invent anything that is not drawn directly from the context.
  Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is no ambiguity in the answer.`;

  (async () => {
    const { textStream } = streamText({
      model: google("gemini-1.5-flash"),
      prompt,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    fileReferences: result,
  };
};
