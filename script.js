// modal

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");

openModalButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

function openModal() {
  overlay.classList.add("active");
  modal.classList.add("active");
  document.querySelector("form")[0].focus();
}

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

function closeModal() {
  overlay.classList.remove("active");
  modal.classList.remove("active");
}

overlay.addEventListener("click", closeModal);

// add book

const submitButton = document.querySelector("[data-submit-button]");
let myLibrary;

if (JSON.parse(localStorage.getItem("Mylibrary")) === null) {
  myLibrary = [];
} else {
  myLibrary = JSON.parse(localStorage.getItem("Mylibrary"));
  myLibrary.forEach((bookObj) => {
    createProject(bookObj);
  });
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = Math.floor(Math.random() * 1000000);
}

submitButton.addEventListener("click", addBook);

function addBook(e) {
  e.preventDefault();
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = document.getElementById("read").checked;
  let book = new Book(title, author, pages, read);
  addBookToLibrary(book);
  addBookToPage(book);
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  addToStorage();
}

function addBookToPage(book) {
  createProject(book);
  closeModal();
  document.querySelector("form").reset();
}

function createProject(book) {
  let bookElement = document.createElement("div");
  let checkBox = createCheckBox(book.read);
  bookElement.classList.add("project");
  bookElement.setAttribute("book-id", `${book.id}`);
  let content = `
      <div class="project-box">
          <div class="options">
              <button class="delete">&times</button>
          </div>
          <div class="book">
              <div class="book-part-section">
                  <span>Title:</span>
                  <span class="book-title">${book.title}</span>
              </div>
              <div class="book-part-section">
                  <span>Author:</span>
                  <span class="book-author">${book.author}</span>
              </div>
              <div class="book-part-section">
                  <span>Pages:</span>
                  <span class="book-pages">${book.pages}</span>
              </div>
  
          </div>
  
          <ul>
              <li><a href="#" class="material-icons-two-tone">favorite</a></li>
              <li><a href="#" class="material-icons-two-tone">visibility</a></li>
              <li><a href="#" class="material-icons-two-tone">share</a></li>
          </ul>
      </div>
  `;
  bookElement.innerHTML = content;
  bookElement.getElementsByClassName("book")[0].appendChild(checkBox);
  document.getElementsByClassName("projects-grid")[0].appendChild(bookElement);
  let box = bookElement.closest(".project");
  let readBtn = checkBox.querySelector("#read");
  addBorder(box, readBtn);
  readBtn.addEventListener("click", checkRead);
  let deleteButton = box.querySelector(".delete");
  deleteButton.addEventListener("click", removeBook);
}

function createCheckBox(read) {
  let div = document.createElement("div");
  div.classList.add("book-part-section");
  let span = document.createElement("span");
  span.innerText = "Read: ";
  let checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.name = "read";
  checkBox.id = "read";

  if (read) {
    checkBox.checked = true;
  } else {
    checkBox.checked = false;
  }
  div.appendChild(span);
  div.appendChild(checkBox);
  return div;
}

function addBorder(box, readBtn) {
  if (readBtn.checked) {
    box.style.borderLeft = "10px solid green";
  } else {
    box.style.borderLeft = "10px solid red";
  }
}

function checkRead(e) {
  let readButton = e.target;
  let box = readButton.parentElement.parentElement.parentElement.parentElement;
  let id = box.getAttribute("book-id");
  let index = findIndexId(id);
  if (readButton.checked) {
    box.style.borderLeft = "10px solid green";
    myLibrary[index].read = true;
  } else {
    box.style.borderLeft = "10px solid red";
    myLibrary[index].read = false;
  }
  addToStorage();
}

function removeBook(e) {
  let id = e.target.closest(".project").getAttribute("book-id");
  let index = findIndexId(id);
  myLibrary.splice(index, 1);
  addToStorage();
  e.target.closest(".project").remove();
}

function findIndexId(id) {
  let index = myLibrary.findIndex((obj) => obj.id == id);
  return index;
}

function addToStorage() {
  localStorage.setItem("Mylibrary", JSON.stringify(myLibrary));
}
