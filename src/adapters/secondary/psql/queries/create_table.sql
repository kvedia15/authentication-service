INSERT INTO "Table" (
        "currentPot",
        "tableId",
        "startTime",
        "roundNumber",
        "tableOrganizerId",
        "updatedAt",
        "createdAt"
    )
VALUES (0, $1, NOW(), 0, $2, NOW(), NOW())
RETURNING "currentPot",
    "tableId",
    "startTime",
    "endTime",
    "roundNumber",
    "tableOrganizerId",
    "updatedAt",
    "createdAt"