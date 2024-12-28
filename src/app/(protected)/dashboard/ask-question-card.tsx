"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import MDEditor from "@uiw/react-md-editor";
import { readStreamableValue } from "ai/rsc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { askQuestion } from "./actions";
import CodeReferences from "./code-references";

const AskQuestionCard = () => {
  const { project } = useProject();

  const [question, setQuestion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setAnswer("");
      setFileReferences([]);

      if (!project?.id) return;
      setIsLoading(true);

      const { output, fileReferences } = await askQuestion(
        question,
        project.id,
      );
      setOpen(true);
      setFileReferences(fileReferences);

      for await (const delta of readStreamableValue(output)) {
        if (delta) setAnswer((ans) => ans + delta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>
              {/* <Image src={"/logo.png"} alt="logo" width={40} height={40} /> */}
            </DialogTitle>
          </DialogHeader>

          <MDEditor.Markdown
            source={answer}
            className="h-full max-h-[40vh] max-w-[70vw] overflow-scroll"
          />
          <div className="h-4"></div>
          <CodeReferences fileReferences={fileReferences} />
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" className="w-1/3" disabled={isLoading}>
              {isLoading ? (
                <span className="flex gap-2">
                  <Loader2 className="mt-[1.5px] animate-spin" />
                  Ask CommitSense!
                </span>
              ) : (
                "Ask CommitSense!"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
