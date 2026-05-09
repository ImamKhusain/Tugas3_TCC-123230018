const Notes = require("../schema/Notes");

// GET ALL NOTES
const findAll = async () => {
  return await Notes.findAll({
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
    order: [["id", "DESC"]],
  });
};

// CREATE NOTE
const create = async (noteData) => {
  return await Notes.create(noteData);
};

// GET NOTE BY ID
const findById = async (id) => {
  return await Notes.findByPk(id, {
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
  });
};

// UPDATE NOTE
const updateById = async (id, noteData) => {
  return await Notes.update(noteData, {
    where: {
      id: id,
    },
  });
};

// DELETE NOTE
const deleteById = async (id) => {
  return await Notes.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};