SELECT 
    "tableId",
    "startTime",
    "endTime",
    "currentPot",
    "roundNumber",
    "tableOrganizerId"
FROM "Table"
WHERE "tableId" = $1
