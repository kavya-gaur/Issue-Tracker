"use client";
import { Button, Callout, Text, TextArea, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";

// interface IssueForm {
//   title: string;
//   description: string;
// }

type IssueForm = z.infer<typeof createIssueSchema>;

const page = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            console.log("error", error);
            setError("An unexpected error occured.");
          }
        })}
      >
        <TextField.Root>
          {/* {<MagnifyingGlassIcon height="16" width="16" />} */}

          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        {errors.title && (
          <Text as="p" color="red">
            {errors.title.message}
          </Text>
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => <SimpleMDE {...field} />}
        />
        {errors.description && (
          <Text as="p" color="red">
            {errors.description.message}
          </Text>
        )}

        <Button>Submit New Issue</Button>
      </form>
    </div>
  );
};

export default page;
