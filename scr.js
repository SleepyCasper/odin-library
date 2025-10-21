/////// Sort and filter
const sortDropdown = document.querySelector(".sort-select");
const sortOrder = document.querySelector(".form-view");
const filterStatus = document.querySelector(".form-status");

/////// Add, select, delete buttons
const btnSelect = document.querySelector(".btn-select");
const bthDeleteAll = document.querySelector(".btn-delete-all");
const btnNewBook = document.querySelector(".btn-new")

/////// Form dialog
const dialogNew = document.getElementById("dialog-new");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const inputStatus = document.getElementById("status");
const btnAdd = document.getElementById("submit");
const btnCancel = document.getElementById("cancel");


let myLibrary = [];

function book(title, author, pages, status, dateFinished) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.dateFinished = dateFinished;
}

// function statusCheck() {
//     if (inputStatus.value) {
        
//     }
// }

function addBookToMyLibrary() {
    let newBook = new book(inputTitle.value, inputAuthor.value, inputPages.value, inputStatus.value, "05.09.2008");
    return myLibrary.push(newBook);
}

btnNewBook.addEventListener("click", () => {
    dialogNew.showModal();
})

btnAdd.addEventListener("click", () => {
    addBookToMyLibrary();
    dialogNew.close();
})

btnCancel.addEventListener("click", () => {
    dialogNew.close();
})