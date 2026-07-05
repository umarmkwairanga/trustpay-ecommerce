import express from "express"; const router = express.Router(); router.get("/", (req, res) => { res.send("SERVER IS OFFICIALLY WORKING via the Routes folder!"); }); export default router;
