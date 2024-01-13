const router = require("express").Router();
const authenticateRole = require("../middleware/authenticateRole.js");

router.get("/admin", authenticateRole("admin"), (req, res) => {
  res.json({ message: "Admin route - Access granted" });
});

module.exports = router;
