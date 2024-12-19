"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  projectName: z.string().min(3, {
    message: "Project name must be at least 3 characters",
  }),
  repoUrl: z.string().url(),
  githubToken: z.string().optional(),
});

const CreateProject = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      projectName: "",
      repoUrl: "",
      githubToken: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    window.alert(JSON.stringify(values, null, 2));
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="projectName"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Input
                  {...(register("projectName"), { required: true })}
                  placeholder="Project Name"
                  className={cn(
                    errors.projectName && "focus-visible:ring-red-500",
                  )}
                  required
                  {...field}
                />
                {errors.projectName && (
                  <p className="text-sm text-red-500">
                    {errors.projectName.message}
                  </p>
                )}
                <div className="h-1"></div>
              </FormItem>
            )}
          />
          <FormField
            name="repoUrl"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Input
                  {...(register("repoUrl"), { required: true })}
                  placeholder="Project URL"
                  className={cn(errors.repoUrl && "focus-visible:ring-red-500")}
                  required
                  {...field}
                />
                {errors.repoUrl && (
                  <p className="text-sm text-red-500">
                    {errors.repoUrl.message}
                  </p>
                )}
                <div className="h-1"></div>
              </FormItem>
            )}
          />
          <FormField
            name="githubToken"
            control={control}
            render={({ field }) => (
              <FormItem>
                <Input
                  {...register("githubToken")}
                  placeholder="Github Token (Optional)"
                  className={cn(
                    errors.githubToken && "focus-visible:ring-red-500",
                  )}
                  {...field}
                />
                {errors.githubToken && (
                  <p className="text-sm text-red-500">
                    {errors.githubToken.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <div className="h-4"></div>
          <Button type="submit">Create Project</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
