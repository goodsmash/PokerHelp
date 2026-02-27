import { createApp } from "../server/app.js";

let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) appPromise = createApp();
  const app = await appPromise;
  return (app as any)(req, res);
}
