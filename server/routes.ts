import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import passport from "passport";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // AUTH ROUTES
  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // DOWNLOADS ROUTES
  app.get(api.downloads.list.path, async (req, res) => {
    const list = await storage.getDownloads();
    res.json(list);
  });

  app.post(api.downloads.create.path, ensureAuthenticated, async (req, res) => {
    try {
      const input = api.downloads.create.input.parse(req.body);
      const download = await storage.createDownload(input);
      res.status(201).json(download);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal error" });
      }
    }
  });

  app.put(api.downloads.update.path, ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.downloads.update.input.parse(req.body);
      const download = await storage.updateDownload(id, input);
      res.json(download);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.delete(api.downloads.delete.path, ensureAuthenticated, async (req, res) => {
    await storage.deleteDownload(parseInt(req.params.id));
    res.status(204).send();
  });

  // VIDEOS ROUTES
  app.get(api.videos.list.path, async (req, res) => {
    const list = await storage.getVideos();
    res.json(list);
  });

  app.post(api.videos.create.path, ensureAuthenticated, async (req, res) => {
    try {
      const input = api.videos.create.input.parse(req.body);
      const video = await storage.createVideo(input);
      res.status(201).json(video);
    } catch (err) {
      res.status(400).json({ message: "Creation failed" });
    }
  });

  app.put(api.videos.update.path, ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.videos.update.input.parse(req.body);
      const video = await storage.updateVideo(id, input);
      res.json(video);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.delete(api.videos.delete.path, ensureAuthenticated, async (req, res) => {
    await storage.deleteVideo(parseInt(req.params.id));
    res.status(204).send();
  });

  // SETTINGS ROUTES
  app.get(api.settings.get.path, async (req, res) => {
    const s = await storage.getSettings();
    res.json(s);
  });

  app.put(api.settings.update.path, ensureAuthenticated, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const s = await storage.updateSettings(input);
      res.json(s);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  // Seed DB Function
  async function seedDatabase() {
    try {
      const adminUsername = "popfork1";
      const adminPassword = "dairyqueen12";
      const existingUser = await storage.getUserByUsername(adminUsername);
      
      if (existingUser) {
        // Update password if it doesn't match the hardcoded one
        const hashedPassword = await hashPassword(adminPassword);
        await storage.updateUser(existingUser.id, { password: hashedPassword });
      } else {
        const hashedPassword = await hashPassword(adminPassword);
        await storage.createUser({ username: adminUsername, password: hashedPassword });
      }

      const videos = await storage.getVideos();
      if (videos.length === 0) {
        await storage.createVideo({
          title: "Quorum Hub - Official Trailer",
          description: "Check out the latest features in Quorum Hub v2.",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        });
      }

      const downloads = await storage.getDownloads();
      if (downloads.length === 0) {
        await storage.createDownload({
          title: "Quorum Client v1.0",
          description: "Stable client release.",
          url: "https://example.com/download/v1",
          status: "working"
        });
        await storage.createDownload({
          title: "Quorum Legacy",
          description: "Older version for compatibility.",
          url: "https://example.com/download/legacy",
          status: "downgrade_required"
        });
      }
    } catch(e) {
      console.error("Failed to seed database", e);
    }
  }

  seedDatabase();

  return httpServer;
}