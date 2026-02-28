import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type DownloadUpdateInput } from "@shared/routes";
import type { InsertDownload } from "@shared/schema";

export function useDownloads() {
  return useQuery({
    queryKey: [api.downloads.list.path],
    queryFn: async () => {
      const res = await fetch(api.downloads.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch downloads");
      return api.downloads.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDownload) => {
      const res = await fetch(api.downloads.create.path, {
        method: api.downloads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(api.downloads.create.input.parse(data)),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create download");
      return api.downloads.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.downloads.list.path] }),
  });
}

export function useUpdateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & DownloadUpdateInput) => {
      const url = buildUrl(api.downloads.update.path, { id });
      const res = await fetch(url, {
        method: api.downloads.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(api.downloads.update.input.parse(updates)),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update download");
      return api.downloads.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.downloads.list.path] }),
  });
}

export function useDeleteDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.downloads.delete.path, { id });
      const res = await fetch(url, {
        method: api.downloads.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete download");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.downloads.list.path] }),
  });
}
