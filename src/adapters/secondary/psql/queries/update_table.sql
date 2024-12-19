UPDATE  "Table"
SET "currentPot" = $1, 
    "roundNumber" = $2,
    "updatedAt" = NOW()
WHERE "tableId" = $3
RETURNING "currentPot",
    "tableId",
    "startTime",
    "endTime",
    "roundNumber",
    "tableOrganizerId",
    "updatedAt",
    "createdAt"
