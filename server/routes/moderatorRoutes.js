const router = require("express").Router();

router.get("/moderator", authenticateRole("moderator"), (req, res) => {
  res.json({ message: "Moderator route - Access granted" });
});

module.exports = router;
