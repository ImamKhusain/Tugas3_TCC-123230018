const API_URL = "http://localhost:3000/api/v1/notes";

const form = document.getElementById("noteForm");
const noteIdInput = document.getElementById("noteId");
const judulInput = document.getElementById("judul");
const isiInput = document.getElementById("isi");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("search");

let allNotes = [];

// =====================
// LOAD NOTES
// =====================
async function loadNotes() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    allNotes = Array.isArray(result) ? result : (result.data || []);
    renderNotes(filterNotes());

  } catch (error) {
    console.error("Gagal mengambil data:", error);
    notesList.innerHTML = `<div class="empty-state">Gagal memuat catatan.</div>`;
  }
}

// =====================
// FILTER NOTES
// =====================
function filterNotes() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) return allNotes;

  return allNotes.filter((note) => {
    const judul = (note.judul || "").toLowerCase();
    const isi = (note.isi || "").toLowerCase();
    return judul.includes(keyword) || isi.includes(keyword);
  });
}

// =====================
// RENDER NOTES
// =====================
function renderNotes(notes) {
  notesList.innerHTML = "";

  if (!notes || notes.length === 0) {
    notesList.innerHTML = `
      <div class="empty-state">
        <strong>Belum ada notes.</strong><br />
        Mulai tulis sesuatu!
      </div>
    `;
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";

    const title = document.createElement("h3");
    title.className = "note-card__title";
    title.textContent = note.judul;

    const body = document.createElement("p");
    body.className = "note-card__body";
    body.textContent = note.isi;

    const meta = document.createElement("div");
    meta.className = "note-card__meta";
    meta.textContent = formatTanggal(note.tanggal_dibuat);

    const actions = document.createElement("div");
    actions.className = "note-card__actions";

    const editBtn = document.createElement("button");
    editBtn.className = "note-btn note-btn--edit";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      fillForm(note);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "note-btn note-btn--delete";
    deleteBtn.textContent = "Hapus";

    deleteBtn.addEventListener("click", async () => {
      await deleteNote(note.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(meta);
    card.appendChild(actions);

    notesList.appendChild(card);
  });
}

// =====================
// FORMAT TANGGAL
// =====================
function formatTanggal(tgl) {
  if (!tgl) return "";
  const d = new Date(tgl);

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// =====================
// FILL FORM FOR EDIT
// =====================
function fillForm(note) {
  noteIdInput.value = note.id;
  judulInput.value = note.judul;
  isiInput.value = note.isi;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// =====================
// RESET FORM
// =====================
function resetForm() {
  noteIdInput.value = "";
  judulInput.value = "";
  isiInput.value = "";
}

// =====================
// SAVE NOTE
// =====================
async function saveNote(e) {
  e.preventDefault();

  const payload = {
    judul: judulInput.value.trim(),
    isi: isiInput.value.trim(),
  };

  if (!payload.judul || !payload.isi) {
    alert("Judul dan isi wajib diisi!");
    return;
  }

  try {
    if (noteIdInput.value) {
      await fetch(`${API_URL}/${noteIdInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Catatan berhasil diupdate!");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Catatan berhasil ditambahkan!");
    }

    resetForm();
    await loadNotes();
  } catch (error) {
    console.error("Gagal simpan:", error);
    alert("Gagal menyimpan catatan.");
  }
}

// =====================
// DELETE NOTE
// =====================
async function deleteNote(id) {
  const confirmDelete = confirm("Yakin ingin menghapus catatan ini?");
  if (!confirmDelete) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    alert("Catatan berhasil dihapus!");
    await loadNotes();
  } catch (error) {
    console.error("Gagal hapus:", error);
    alert("Gagal menghapus catatan.");
  }
}

// =====================
// SEARCH
// =====================
searchInput.addEventListener("input", () => {
  renderNotes(filterNotes());
});

// =====================
// FORM SUBMIT
// =====================
form.addEventListener("submit", saveNote);

// =====================
// INIT
// =====================
loadNotes();