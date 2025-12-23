"use client";

import { createSecureJwt, decodeSecureJwt, fetchSupaProject } from "@/actions";
import ProjectForm from "@/components/project-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  CircleCheckIcon,
  DownloadCloudIcon,
  EllipsisVerticalIcon,
  LoaderIcon,
  PlusIcon,
  RefreshCcwIcon,
  ShareIcon,
} from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [projects, setProjects] = useLocalStorage("supaPing", []);
  const [initialData, setInitialData] = useState(undefined);

  const setReadyOnRender = useEffectEvent(() => {
    setReady(true);
  });

  const deleteProject = (projectToDelete) => {
    const updatedProjects = projects.filter(
      (project) => project.url !== projectToDelete.url
    );
    setProjects(updatedProjects);
  };

  useEffect(() => {
    setReadyOnRender();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) setInitialData(undefined);
  }, [open]);

  return (
    ready && (
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4 justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-emerald-700">
            SupaPing
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <PlusIcon />
              <span className="hidden md:inline">Add Project</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setRefetch(!refetch)}
            >
              <RefreshCcwIcon />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Token</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody key={refetch}>
              {projects.length ? (
                projects.map((project, index) => (
                  <ProjectRow
                    key={index}
                    project={project}
                    setOpen={setOpen}
                    deleteProject={deleteProject}
                    setInitialData={setInitialData}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Import or add a Supabase project to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <DownloadCloudIcon />
                <span className="hidden md:inline">Import Projects</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = e.target[0].value;
                  if (!token) return document.getElementById("cancel").click();
                  const { projects: imported = [] } = await decodeSecureJwt(
                    token
                  );
                  setProjects([...projects, ...imported]);
                  e.target[0].value = "";
                  document.getElementById("cancel").click();
                }}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="jwt-token">
                      Enter token below
                    </FieldLabel>
                    <Textarea
                      id="jwt-token"
                      className={"max-h-40 text-xs"}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <DialogClose asChild>
                      <Button variant="outline" type="button" id="cancel">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Import</Button>
                  </Field>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              const token = await createSecureJwt({ projects });
              navigator.clipboard.writeText(token);
              toast.success(
                "Token copied to clipboard! Paste it to import your projects."
              );
            }}
          >
            <ShareIcon />
            <span className="hidden md:inline">Export Projects</span>
          </Button>
        </div>
        <ProjectForm open={open} setOpen={setOpen} initialData={initialData} />
      </main>
    )
  );
};

export default Home;

const ProjectRow = ({ project, setOpen, deleteProject, setInitialData }) => {
  const [status, setStatus] = useState("pinging");

  const refetch = useCallback(() => {
    setStatus("pinging");
    fetchSupaProject(project.url, project.token, project.table)
      .then(() => {
        setStatus("success");
      })
      .catch((error) => {
        console.error("Error fetching Supabase project:", error);
        setStatus("error");
      });
  }, [project.url, project.token, project.table]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell>{project.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {status === "success" ? (
            <>
              <CircleCheckIcon className="fill-green-500 dark:fill-green-400 text-white" />
              Success
            </>
          ) : status === "error" ? (
            <>
              <CircleCheckIcon className="fill-red-500 dark:fill-red-400 text-white" />
              Error
            </>
          ) : (
            <>
              <LoaderIcon className="animate-spin" />
              Pinging...
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell className={"hover:underline"}>
        <Tooltip>
          <TooltipTrigger>
            {project.url.length > 30
              ? project.url.slice(0, 30) + "..."
              : project.url}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs break-all">
            {project.url}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>{project.table}</TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>*********</TooltipTrigger>
          <TooltipContent className="max-w-xs break-all">
            {project.token}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={refetch}>Refetch</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setInitialData(project);
                setOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteProject(project)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
