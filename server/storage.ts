import { db, pool } from "./db";
import { users, downloads, videos, settings, type User, type InsertUser, type Download, type InsertDownload, type Video, type InsertVideo, type Settings, type UpdateSettings } from "@shared/schema";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";

const PostgresStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  getDownloads(): Promise<Download[]>;
  createDownload(download: InsertDownload): Promise<Download>;
  updateDownload(id: number, download: Partial<InsertDownload>): Promise<Download>;
  deleteDownload(id: number): Promise<void>;

  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;

  getSettings(): Promise<Settings>;
  updateSettings(updates: UpdateSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, update: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(update).where(eq(users.id, id)).returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async getDownloads(): Promise<Download[]> {
    return await db.select().from(downloads);
  }

  async createDownload(download: InsertDownload): Promise<Download> {
    const [res] = await db.insert(downloads).values(download).returning();
    return res;
  }

  async updateDownload(id: number, update: Partial<InsertDownload>): Promise<Download> {
    const [res] = await db.update(downloads).set(update).where(eq(downloads.id, id)).returning();
    if (!res) throw new Error("Download not found");
    return res;
  }

  async deleteDownload(id: number): Promise<void> {
    await db.delete(downloads).where(eq(downloads.id, id));
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [res] = await db.insert(videos).values(video).returning();
    return res;
  }

  async updateVideo(id: number, update: Partial<InsertVideo>): Promise<Video> {
    const [res] = await db.update(videos).set(update).where(eq(videos.id, id)).returning();
    if (!res) throw new Error("Video not found");
    return res;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  async getSettings(): Promise<Settings> {
    let [res] = await db.select().from(settings).where(eq(settings.id, "global"));
    if (!res) {
      [res] = await db.insert(settings).values({ id: "global" }).returning();
    }
    return res;
  }

  async updateSettings(updates: UpdateSettings): Promise<Settings> {
    let [res] = await db.update(settings).set(updates).where(eq(settings.id, "global")).returning();
    if (!res) {
      [res] = await db.insert(settings).values({ id: "global", ...updates }).returning();
    }
    return res;
  }
}

export const storage = new DatabaseStorage();