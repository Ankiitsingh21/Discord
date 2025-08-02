import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server"

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth(); // Add await here
  if (!userId) throw new UploadThingError("Unauthorized");
  return { userId: userId };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth()) // Make middleware async
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Return metadata to be available in onClientUploadComplete
      return { uploadedBy: metadata.userId };
    }),

  messageFile: f(["image", "pdf"])
    .middleware(async () => await handleAuth()) // Make middleware async
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Return metadata to be available in onClientUploadComplete
      return { uploadedBy: metadata.userId };
    })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;