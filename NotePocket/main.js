class Note {
  constructor(date, title, content, color) {
    this.date = date;
    this.title = title;
    this.content = content;
    this.color = color;
    this.pin = false;
  }
}

// -------------------------------- EVENTS --------------------------------

let notesList = clearArray(JSON.parse(localStorage.getItem("notes")));

renderNotes();

function showNote(note, index) {
  const d = document.querySelector("#notes");

  d.innerHTML += `<div class="note shadowbox" data-index="${index}" style="background-color: ${note.color}">
                    <div class="content">
                      <h2>${note.title}</h2>
                      <p>${note.content}</p>
                      <div>${note.date}</div>
                    </div>
                    <div class="pin"><i class="fas fa-thumbtack"></i></div>
                    <div class="trash"><i class="fas fa-trash"></i></div>
                  </div>`;
}

function saveNoteToStorage(note) {
  localStorage.setItem("notes", JSON.stringify(notesList));
  console.log("Notes saved...");
}

function clearArray(array) {
  return array.filter(el => el != null)
    .sort(el => {
      console.log(el.pin);
      if (el.pin) return -1;
      else return 1;
    });
}

function renderNotes() {
  document.querySelector("#notes").innerHTML = "";
  clearArray(notesList).forEach((note, index) => {
    showNote(note, index);
  });

  [...document.querySelectorAll(".note")].forEach(el => {
    el.querySelector(".pin").addEventListener("click", () => {
      notesList[el.dataset.index].pin = !notesList[el.dataset.index].pin;

      console.log(notesList[el.dataset.index].pin);
    });

    el.querySelector(".trash").addEventListener("click", function() {
      console.log(el);

      deleteNote(el);
    });
  });

  console.log(notesList);
}

function deleteNote(note) {
  delete notesList[note.dataset.index];

  renderNotes();
  saveNoteToStorage();
}

function addNoteToList(note) {
  notesList.push(note);
}

// -------------------------------- EVENTS --------------------------------

document.querySelector("#close").addEventListener("click", e => {
  const element = document.querySelector("#modal");
  element.style.display = "none";
  document.body.style.overflow = "auto";
});

document.querySelector("#plus").addEventListener("click", e => {
  const element = document.querySelector("#modal");
  element.style.display = "block";
  document.body.style.overflow = "auto";
});

document.querySelectorAll(".pin").forEach(element => {
  element.addEventListener("click", e => {
    element.classList.toggle;
  });
});

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();

  const form = document.forms[0];
  const fd = new FormData(form);
  let data = {};

  for (let [key, prop] of fd) {
    data[key] = prop;
  }

  const note = new Note(
    new Date().toLocaleString(),
    data.title,
    data.content,
    data.color
  );

  addNoteToList(note);
  renderNotes();
  saveNoteToStorage(note);
});
