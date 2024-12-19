INSERT INTO "User" (
    "username",
    "password",
    "email"
    )
VALUES ($1, $2, $3)
RETURNING "id", "username", "email"