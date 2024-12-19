-- CreateTable
CREATE TABLE "Player" (
    "playerId" TEXT NOT NULL,
    "chipCount" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("playerId")
);

-- CreateIndex
CREATE INDEX "Player_tableId_idx" ON "Player"("tableId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("tableId") ON DELETE RESTRICT ON UPDATE CASCADE;
