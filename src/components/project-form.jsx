"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const ProjectForm = ({
  open,
  setOpen,
  initialData = {
    name: "",
    url: "",
    token: "",
    table: "",
  },
}) => {
  const [project, setProject] = useState(initialData);
  const [_, setProjects] = useLocalStorage("supaPing", []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProjects([..._, project]);
    setOpen(false);
  };

  useEffect(() => {
    setProject(initialData);
  }, [initialData]);

  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {initialData.name ? "Edit Project" : "Add Project"}
          </DialogTitle>
          <DialogDescription>
            Prevent your Supabase project from getting paused.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Project name</FieldLabel>
              <Input
                id="name"
                placeholder="My Supabase Project"
                required
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="url">Project URL</FieldLabel>
              <Input
                id="url"
                placeholder="https://my-supabase-project.supabase.co"
                required
                value={project.url}
                onChange={(e) =>
                  setProject({ ...project, url: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="token">Project Token</FieldLabel>
              <Input
                id="token"
                placeholder="Your project token"
                type={"password"}
                required
                value={project.token}
                onChange={(e) =>
                  setProject({ ...project, token: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="table">Table name</FieldLabel>
              <Input
                id="table"
                placeholder="users"
                required
                value={project.table}
                onChange={(e) =>
                  setProject({ ...project, table: e.target.value })
                }
              />
            </Field>
            <Field orientation="horizontal">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
