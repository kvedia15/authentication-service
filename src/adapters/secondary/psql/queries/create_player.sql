INSERT INTO "Player"
    ("playerId", "chipCount", "name", "tableId")
VALUES ($1, $2, $3, $4)
RETURNING "playerId", "chipCount", "name", "tableId"