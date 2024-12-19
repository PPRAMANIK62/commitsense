"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreateProject = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit = (data: FormInput) => {
    window.alert(JSON.stringify(data, null, 2));
    return true;
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image
        src="/undraw_github.svg"
        width={300}
        height={300}
        alt="github_undraw"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your Github Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your Github repository to link it to CommitSense
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...(register("projectName"), { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...(register("repoUrl"), { required: true })}
              placeholder="Project URL"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)"
            />
            <div className="h-4"></div>
            <Button type="submit">Create Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
