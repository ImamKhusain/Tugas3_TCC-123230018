const notesModel = require("../models/notesModels");

// =====================
// GET ALL NOTES
// =====================
const getAllNotes = async (req, res) => {
  try {
    const allNotes = await notesModel.findAll();

    res.status(200).json({
      message: "Notes retrieved successfully",
      data: allNotes || [],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving notes",
      error: error.message,
    });
  }
};

// =====================
// CREATE NOTE
// =====================
const createNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({
        message: "Judul dan isi wajib diisi",
      });
    }

    const newNote = await notesModel.create({ judul, isi });

    res.status(201).json({
      message: "Note created successfully",
      data: newNote,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};

// =====================
// GET NOTE BY ID
// =====================
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await notesModel.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note retrieved successfully",
      data: note,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving note",
      error: error.message,
    });
  }
};

// =====================
// UPDATE NOTE
// =====================
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi } = req.body;

    const note = await notesModel.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await notesModel.updateById(id, { judul, isi });

    res.status(200).json({
      message: "Note updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
};

// =====================
// DELETE NOTE
// =====================
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await notesModel.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await notesModel.deleteById(id);

    res.status(200).json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting note",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};