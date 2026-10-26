CREATE TABLE "dm_media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dmId" TEXT NOT NULL,
    CONSTRAINT "dm_media_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "dm_media" ADD CONSTRAINT "dm_media_dmId_fkey"
  FOREIGN KEY ("dmId") REFERENCES "dms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
