const express = require("express");

const app = express();

app.get("/api/roles", (_req, res) => {
  res.json([{ id: "admin", name: "Administrator" }]);
});

app.listen(3001, () => {
  console.log("admin-role-app api listening on 3001");
});
