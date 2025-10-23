/////// Sort and filter
const sortDropdown = document.querySelector(".sort-select");
const sortOrder = document.querySelector(".form-view");
const filterStatus = document.querySelector(".form-status");

/////// Add, select, delete buttons
const btnSelect = document.querySelector(".btn-select");
const bthDeleteAll = document.querySelector(".btn-delete-all");
const btnNewBook = document.querySelector(".btn-new")

/////// Form dialog
const form = document.getElementById("form");
const dialogNew = document.getElementById("dialog-new");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const inputStatus = document.getElementById("status");
const dateWrapper = document.getElementById("date-wrapper");
const inputDate = document.getElementById("date")
const btnAdd = document.getElementById("submit");
const btnCancel = document.getElementById("cancel");

////// Cards field
const wrapperCards = document.querySelector(".wrapper-cards");

let myLibrary = [];

function book(title, author, pages, status, dateFinished) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.dateFinished = dateFinished;
}

function statusCheck() {
    if (!inputStatus.checked) {
        inputStatus.value = "not read";
        dateWrapper.style.display = "none";
        inputDate.removeAttribute("required");
    } else {
        inputStatus.value = "read";
        dateWrapper.style.display = "flex";
        inputDate.setAttribute("required", "");
    }
}

function resetForm() {
    inputTitle.value = "";
    inputAuthor.value = "";
    inputPages.value = "";
    inputStatus.value = "not read";
    inputStatus.checked = false;
    inputDate.removeAttribute("required");
    inputDate.value = "";
    dateWrapper.style.display = "none";
}

function addBookToMyLibrary() {
    let newBook = new book(
        inputTitle.value, 
        inputAuthor.value, 
        inputPages.value, 
        inputStatus.value, 
        inputStatus.checked ? inputDate.value : null
    );
    return myLibrary.push(newBook);
}

function addAllBookCards() {
    wrapperCards.innerHTML = "";
    myLibrary.forEach((book) => {
        let bookCard = document.createElement("div");
        bookCard.classList.add("card");
        bookCard.id = book.id;

        bookCard.innerHTML = `
            <h2 class="card-title">${book.title}</h2>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <p>Status: ${book.status}</p>
            ${book.dateFinished ? `<p>Finished: ${book.dateFinished}</p>` : ''}
            `;

        wrapperCards.appendChild(bookCard);
    })
}

btnNewBook.addEventListener("click", () => {
    dialogNew.showModal();
})

inputStatus.addEventListener("change", () => {
    statusCheck();
})

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission
    addBookToMyLibrary();
    addAllBookCards();
    dialogNew.close();
    resetForm();
})

btnCancel.addEventListener("click", () => {
    dialogNew.close();
    resetForm();
})