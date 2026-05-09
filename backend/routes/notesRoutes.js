const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

// GET semua notes
router.get("/", notesController.getAllNotes);

// GET note by id
router.get("/:id", notesController.getNoteById);

// CREATE note
router.post("/", notesController.createNote);

// UPDATE note
router.put("/:id", notesController.updateNote);

// DELETE note
router.delete("/:id", notesController.deleteNote);

module.exports = router;