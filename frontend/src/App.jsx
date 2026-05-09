import { useEffect, useMemo, useState } from "react";
import "./index.css";

const API_URL = "https://tugas3-tcc-123230018-764024000152.us-central1.run.app";

function App() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  // LOAD NOTES
  const loadNotes = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();

      setNotes(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // FILTER
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const j = (note.judul || "").toLowerCase();
      const i = (note.isi || "").toLowerCase();
      const q = search.toLowerCase();

      return j.includes(q) || i.includes(q);
    });
  }, [notes, search]);

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      judul,
      isi,
    };

    if (!judul || !isi) {
      alert("Judul dan isi wajib diisi!");
      return;
    }

    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        alert("Catatan berhasil diupdate!");
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        alert("Catatan berhasil ditambahkan!");
      }

      setJudul("");
      setIsi("");
      setEditId(null);

      loadNotes();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan catatan");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus catatan ini?");

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      alert("Catatan berhasil dihapus!");
      loadNotes();
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
  const handleEdit = (note) => {
    setEditId(note.id);
    setJudul(note.judul);
    setIsi(note.isi);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="page">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar__title">
          Welcome in MY NOTES
        </div>

        <div className="topbar__search">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* FORM */}
      <section className="composer">
        <div className="composer__title">
          APLIKASI NOTES
        </div>

        <form className="note-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Judul Catatan"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />

          <textarea
            className="textarea-field"
            placeholder="Isi Catatan"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
          />

          <button className="btn-save" type="submit">
            + {editId ? "Update" : "Simpan"}
          </button>
        </form>
      </section>

      {/* DIVIDER */}
      <div className="divider"></div>

      {/* NOTES */}
      <section className="notes-section">
        <div className="notes-section__header">
          <div className="notes-title">
            <h2>MY NOTES</h2>
            <span className="section-line"></span>
          </div>
        </div>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              Gagal memuat catatan.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <article className="note-card" key={note.id}>
                <h3 className="note-card__title">
                  {note.judul}
                </h3>

                <p className="note-card__body">
                  {note.isi}
                </p>

                <div className="note-card__actions">
                  <button
                    className="note-btn note-btn--edit"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>

                  <button
                    className="note-btn note-btn--delete"
                    onClick={() => handleDelete(note.id)}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;