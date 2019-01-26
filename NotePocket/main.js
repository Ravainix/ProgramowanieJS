class Note {
  /**
   * Class representing a note
   * @param {number} date - Timestamp when created
   * @param {string} title - Title of note
   * @param {string} content - Content of note
   * @param {string} color - Color of note
   */
  constructor(date, title, content, color) {
    this.id = Math.random().toString(36).substr(2, 9); // generate random ID
    this.date = date;
    this.title = title;
    this.content = content;
    this.color = color;
    this.pin = false;
  }
}

// -------------------------------- EVENTS --------------------------------

let notesList = []
//console.log(notesList);

/**
 * 
 */
function init () {
  notesList = getItemsFromStorage() //JSON.parse(localStorage.getItem("notes"));
  renderNotes();
}

/**
 * Gets saved notes from localstorage
 */
function getItemsFromStorage() {
  return !JSON.parse(localStorage.getItem("notes")) ? [] : JSON.parse(localStorage.getItem("notes"))
}

/**
 * Renders a note according to a defined template
 * @param {object} note - Rendered note
 */
function renderNote(note) {
  const d = document.querySelector("#notes-grid");

  d.innerHTML += `<div class="note shadowbox" data-id="${note.id}" style="background-color: ${note.color}">
                    <div class="content">
                      <div class="title">${note.title}</div>
                      <p>${note.content}</p>
                      <div>${new Date(note.date).toLocaleString()}</div>
                    </div>
                    <div class="placeholder2">
                      <div class="pin"><i class="fas fa-thumbtack ${note.pin ? "pinned" : ""}"></i></div>
                      <div class="trash"><i class="fas fa-trash"></i></div>
                  </div>
                  </div>`;
}

/**
 * Saves array with notes to localstorage
 */
function saveNoteToStorage() {
  localStorage.setItem("notes", JSON.stringify(sortArray(notesList)));
  console.log("Notes saved...");
}

/**
 * Returns a sorted array according to multi criteria (is pinned and time)
 * @param {array} array - Array to sort
 */
function sortArray(array) {
  if(array === null) return []

  return array
  .sort( (el, el2) => {
    if(el.pin != el2.pin) {
      return el.pin ? -1 : 1
    } else {
      return el.date - el2.date
    }
  });
}

/**
 * Renders saved notes in an array and adds, pin functions to them 
 */
function renderNotes() {
  document.querySelector("#notes-grid").innerHTML = "";
  let sortedList = sortArray(notesList)
  
  if(sortedList === null) return;

  sortedList.forEach((note) => {
    renderNote(note);
  });

  [...document.querySelectorAll(".note")].forEach(el => {
    el.querySelector(".pin").addEventListener("click", () => {
      sortedList[findIndex(el, sortedList)].pin = !sortedList[findIndex(el, sortedList)].pin;
      el.children[1].classList.toggle("pinned")
      renderNotes()
    });

    el.querySelector(".trash").addEventListener("click", function() {
       //console.log(el);

      deleteNote(findIndex(el, notesList));
    });
  });

  //console.log(notesList);
  console.log(sortedList);
}

/**
 * Removes the note
 * @param {object} note - Note to delete
 */
function deleteNote(note) {
  // delete clearArray(notesList).note.dataset.index;

  //let index = findIndex(note, sortedList) //notesList.findIndex(el => el.id === note.dataset.id)
  
  //console.log(index);
  
  console.log(notesList.splice(note, 1));
  

  renderNotes();
  //saveNoteToStorage();
}

/**
 * Search index of note by id in array
 * @param {object} note - Search note
 * @param {array} list - Array to search
 */
function findIndex (note, list) {
  return list.findIndex(el => el.id === note.dataset.id)
}

/**
 * Adds note to notes array
 * @param {object} note - Note to add
 */
function addNoteToList(note) {
  notesList.push(note);
}

// -------------------------------- EVENTS --------------------------------

// document.querySelector("#close").addEventListener("click", e => {
//   const element = document.querySelector("#modal");
//   element.style.display = "none";
//   document.body.style.overflow = "auto";
// });

// document.querySelector("#plus").addEventListener("click", e => {
//   const element = document.querySelector("#modal");
//   element.style.display = "block";
//   document.body.style.overflow = "auto";
// });

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();

  const form = document.forms[0];
  const fd = new FormData(form);
  let data = {};

  for (let [key, prop] of fd) {
    data[key] = prop;
  }

  const note = new Note(
    new Date().getTime(),
    data.title,
    data.content,
    data.color
  );

  addNoteToList(note);
  renderNotes();
  saveNoteToStorage();
});

init();