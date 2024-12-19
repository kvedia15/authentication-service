UPDATE  "Player"
SET "chipCount" = $1, 
WHERE "playerId" = $2 
RETURNING "playerId", "chipCount", "name", "tableId"
