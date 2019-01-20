class Note {
  constructor(date, title, content, color) {
    this.date = date;
    this.title = title;
    this.content = content;
    this.color = color;
  }
}

// let notes = [
//   new Note(new Date("08.01.2018").toLocaleString(), "Test1", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, explicabo.", "red"),
//   new Note(new Date("11.01.2012").toLocaleString(), "Test2", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, explicabo.", "blue"),
//   new Note(new Date("10.03.2017").toLocaleString(), "Test3", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, explicabo.", "green"),
//   new Note(new Date("01.02.2010").toLocaleString(), "Test4", "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, explicabo.", "aqua"),
// ]

// localStorage.setItem('notes', JSON.stringify(notes))

let notes = JSON.parse(localStorage.getItem("notes"));

notes.forEach(note => {
  showNote(note);
  // note.show("#notes")
});

function showNote(note) {
  const d = document.querySelector("#notes");

  d.innerHTML += `<div class="note" style="background-color: ${note.color}">
                    <h2>${note.title}</h2>
                    <p>${note.content}</p>
                    <div>${note.date}</div>
                  </div>`;
}

function saveNote(note) {
  let notes = JSON.parse(localStorage.getItem("notes"))
  console.log(notes)
  notes.push(note) 

  localStorage.setItem('notes', JSON.stringify(notes))
  console.log("Note added");
  
}

document.querySelector("#close").addEventListener('click', e => {
  const element = document.querySelector("#modal")
  element.style.display = "none";
  document.body.style.overflow = "auto"
})

document.querySelector("#plus").addEventListener('click', e => {
  const element = document.querySelector("#modal")
  element.style.display = "block";
  document.body.style.overflow = "auto"
})

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();

  const form = document.forms[0]
  const fd = new FormData(form);
  let data = {}

  for (let [key, prop] of fd) {
    data[key] = prop;
  }

  data.date = new Date().toLocaleString()

  saveNote(data)
  showNote(data)
});
