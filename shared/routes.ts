import { z } from 'zod';
import { insertDownloadSchema, insertVideoSchema, updateSettingsSchema, downloads, videos, settings, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: { 200: z.object({ message: z.string() }) }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  downloads: {
    list: {
      method: 'GET' as const,
      path: '/api/downloads' as const,
      responses: { 200: z.array(z.custom<typeof downloads.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/downloads' as const,
      input: insertDownloadSchema,
      responses: { 201: z.custom<typeof downloads.$inferSelect>() }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/downloads/:id' as const,
      input: insertDownloadSchema.partial(),
      responses: { 200: z.custom<typeof downloads.$inferSelect>() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/downloads/:id' as const,
      responses: { 204: z.void() }
    }
  },
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos' as const,
      responses: { 200: z.array(z.custom<typeof videos.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/videos' as const,
      input: insertVideoSchema,
      responses: { 201: z.custom<typeof videos.$inferSelect>() }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/videos/:id' as const,
      input: insertVideoSchema.partial(),
      responses: { 200: z.custom<typeof videos.$inferSelect>() }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/videos/:id' as const,
      responses: { 204: z.void() }
    }
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: { 200: z.custom<typeof settings.$inferSelect>() }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/settings' as const,
      input: updateSettingsSchema,
      responses: { 200: z.custom<typeof settings.$inferSelect>() }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type DownloadUpdateInput = z.infer<typeof api.downloads.update.input>;
export type VideoUpdateInput = z.infer<typeof api.videos.update.input>;
