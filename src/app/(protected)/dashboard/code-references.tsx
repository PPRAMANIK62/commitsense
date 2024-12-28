"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Prism } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  fileReferences: { fileName: string; sourceCode: string; summary: string }[];
};

const CodeReferences = ({ fileReferences }: Props) => {
  const [tab, setTab] = useState<string | undefined>(
    fileReferences[0]?.fileName,
  );
  if (fileReferences.length === 0) return null;

  return (
    <div className="max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-scroll rounded-md bg-gray-200 p-1">
          {fileReferences.map(({ fileName }) => (
            <Button
              key={fileName}
              onClick={() => setTab(fileName)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                {
                  "bg-primary text-primary-foreground": tab === fileName,
                },
              )}
            >
              {fileName}
            </Button>
          ))}
        </div>
        {fileReferences.map(({ fileName, sourceCode }) => (
          <TabsContent
            key={fileName}
            value={fileName}
            className="max-h-[40vh] max-w-7xl overflow-scroll rounded-md"
          >
            <Prism language="typescript" style={lucario}>
              {sourceCode}
            </Prism>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
