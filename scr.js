/////// Sort and filter
const sortDropdown = document.getElementById("sort-select");
const radioAscending = document.getElementById("ascending");
const radioDescending = document.getElementById("descending");
const radioAll = document.getElementById("all");
const radioRead = document.getElementById("read");
const radioNotRead = document.getElementById("not-read");

/////// Add, select, delete buttons
const btnSelect = document.getElementById("btn-select");
const btnSelectAll = document.getElementById("btn-select-all");
const btnDelete = document.getElementById("btn-delete");
const btnNewBook = document.getElementById("btn-new");
const dialogDelete = document.getElementById("dialog-delete");
const btnDeleteYes = document.getElementById("btn-delete-yes");
const btnDeleteNo = document.getElementById("btn-delete-no");

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
const containerCards = document.querySelector(".wrapper-cards");
const cards = document.querySelectorAll(".card");

const dialogCalendar = document.getElementById("dialog-calendar-finished")

class Book {
    #id;
    #dateAdded;

  constructor(title, author, pages, status, dateFinished, dateAdded, coverColor) {
    this.#id = crypto.randomUUID();
    this.#dateAdded = dateAdded ? new Date(dateAdded) : new Date();
    
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.dateFinished = dateFinished;
    
    if (coverColor) {
        this.coverColor = coverColor;
    } else {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 50;
        const lightness = Math.floor(Math.random() * 20) + 40;
        this.coverColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
    }
  }

  get id() {
    return this.#id;
  }

  get   () {
    return this.#dateAdded;
  }
}

let myLibrary = [
    new Book (
        "Harry Potter and Goblet of Fire", 
        "J.K. Rowling", 
        "636", 
        "read", 
        "2025-10-10",
        "2025-01-15"
    ),
    new Book (
        "Lord of The Ring", 
        "J.R.R. Tolkien",
        "636",
        "read",
        "2025-10-10",
        "2025-01-15"
        ),
    new Book (
        "To Kill a Mockingbird",
        "Harper Lee",
        "281",
        "not read",
        null,
        "2025-01-17"
    ),
    new Book(
        "Of Mice and Men",
        "John Steinbeck",
        "107",
        "not read",
        null,
        "2025-01-18"
    ),
    new Book(
        "Percy Jackson. The Lightning Thief",
        "Rick Riordan",
        "377",
        "not read",
        null,
        "2025-01-19"
    ),
    new Book(
        "Alice in Wonderland",
        "Lewis Carroll",
        "192",
        "not read",
        null,
        "2025-01-20"
    ),
];

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
    const title = inputTitle.value;
    const author = inputAuthor.value;
    const pages = inputPages.value;
    const status = inputStatus.value;
    const dateFinished = inputStatus.checked ? inputDate.value : null;

    let newBook = new Book(title, author, pages, status, dateFinished);

    myLibrary.push(newBook);
}

function addAllBookCards() {
    containerCards.innerHTML = "";
    myLibrary.forEach((book) => {
        const optionsWrapper = document.createElement("div");
        optionsWrapper.classList.add("options-wrapper");

        let cardWrapper = document.createElement("div");
        cardWrapper.classList.add("card-wrapper");
        cardWrapper.dataset.id = book.id;

        let selectCheckbox = document.createElement("input");
        selectCheckbox.setAttribute("type", "checkbox");
        selectCheckbox.classList.add("card-checkbox");
        selectCheckbox.dataset.id = book.id; // Link to book

        let readIcon = document.createElement("button");
        readIcon.setAttribute("type", "button");
        readIcon.classList.add("read-icon");
        readIcon.dataset.id = book.id;

        let bookCard = document.createElement("div");
        bookCard.classList.add("card");
        bookCard.dataset.id = book.id;
        bookCard.style.setProperty('--card-tint', book.coverColor); 

        bookCard.innerHTML = `
            <h2 class="card-title">${book.title}</h2>
            <div class="pop-up">
                <p><span>Author:</span> ${book.author}</p>
                <p><span>Pages:</span> ${book.pages}</p>
                <p><span>Status:</span> ${book.status}</p>
                ${book.dateFinished ? `<p><span>Finished:</span> ${book.dateFinished}</p>` : ''}
            </div>`;

        cardWrapper.appendChild(optionsWrapper)
        optionsWrapper.appendChild(readIcon);
        optionsWrapper.appendChild(selectCheckbox);
        cardWrapper.appendChild(bookCard);
        containerCards.appendChild(cardWrapper);
    })

    ////// Checking for selected checkboxes and updating delete button
    const checkboxes = document.querySelectorAll(".card-checkbox");
    checkboxes.forEach(cb => cb.addEventListener("change", updateDeleteButtonState));

    const readIcons = document.querySelectorAll(".read-icon");
    readIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            changeReadStatus(e.target);
        });
    })

    setReadStatusIcon();
    updateDeleteButtonState();
}

function sortBooks() {
    const isAscending = radioAscending.checked;

    if (sortDropdown.value === "title") {
        myLibrary.sort((a, b) => {
            return isAscending 
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
    }

    if (sortDropdown.value === "date-added") {
        myLibrary.sort((a, b) => {
            return isAscending
                ? a.dateAdded - b.dateAdded  // Oldest first
                : b.dateAdded - a.dateAdded; // Newest first
        });
    }

    if (sortDropdown.value === "date-finished") {
        myLibrary.sort((a, b) => {
            if (!a.dateFinished) return 1;
            if (!b.dateFinished) return -1;

            return isAscending
                ? a.dateFinished.localeCompare(b.dateFinished)
                : b.dateFinished.localeCompare(a.dateFinished);
        });
    }
    addAllBookCards();
}

function uncheckHiddenBooks() {
    const cardWrappers = document.querySelectorAll(".card-wrapper");
    cardWrappers.forEach(wrapper => {
        const checkbox = wrapper.querySelector(".card-checkbox");
        if (wrapper.style.display === "none" && checkbox.checked) {
            checkbox.checked = false;
        }
    });
}

function filter() {
    const cardWrapper = document.querySelectorAll(".card-wrapper");

    cardWrapper.forEach(card => {
        const book = myLibrary.find(b => b.id === card.dataset.id);

        if (radioAll.checked) {
            card.style.display = "flex";
        } 
        else if (radioRead.checked) {
            if (book.status === "read") {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        } 
        else if (radioNotRead.checked) {
            if (book.status === "not read") {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        }
    });

    uncheckHiddenBooks();
    updateDeleteButtonState();
}

function showCheckboxes() {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    checkboxes.forEach(cb => cb.classList.add("visible"));
    updateDeleteButtonState();
}

function hideCheckboxes() {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    checkboxes.forEach(cb => {
        cb.classList.remove("visible");
        cb.checked = false; // Uncheck when hiding
    });
    updateDeleteButtonState();
}

function selectAll(e) {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    if (e.target.textContent === "Select all") {
        checkboxes.forEach(cb => cb.checked = true);
        e.target.textContent = "Unselect all";
    } else {
        checkboxes.forEach(cb => cb.checked = false);
        e.target.textContent = "Select all";
    }
    updateDeleteButtonState();
}

function deleteSelected() {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    checkboxes.forEach(checkbox => {
        const book = myLibrary.find(b => b.id === checkbox.dataset.id);
        if (checkbox.checked) {
            let index = myLibrary.indexOf(book);  
            myLibrary.splice(index, 1);
        }
    })

    sortBooks();
    addAllBookCards();
    filter();
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

    btnDelete.disabled = !anyChecked;
}

function deleteDialog() {
    dialogDelete.showModal();
}

function setReadStatusIcon() {
    const readIcons = document.querySelectorAll(".read-icon");
    readIcons.forEach(icon => {
        const book = myLibrary.find(b => b.id === icon.dataset.id);
        if (book.status === "read") {
            icon.classList.add("read");
            icon.classList.remove("not-read");
        } else {
            icon.classList.add("not-read")
            icon.classList.remove("read");
        }
    })
}

function changeReadStatus(icon) {
    const inputCalendar = document.getElementById("date-finished");
    const cardWrapper = icon.closest('.card-wrapper');
    const card = cardWrapper.querySelector('.card');
    const popup = card.querySelector('.pop-up');
    const book = myLibrary.find(b => b.id === icon.dataset.id);

    function updatePopup() {
        popup.innerHTML = `
        <p><span>Author:</span> ${book.author}</p>
        <p><span>Pages:</span> ${book.pages}</p>
        <p><span>Status:</span> ${book.status}</p>
        ${book.dateFinished ? `<p><span>Finished:</span> ${book.dateFinished}</p>` : ''}
        `;
    }    
    
    dialogCalendar.setAttribute("closedBy", "any")

    if (book.status === "not read") {
        dialogCalendar.showModal();

        // Handle date selection
        const handleDateChange = () => {
            if (inputCalendar.value !== "") {
                book.status = "read";
                book.dateFinished = inputCalendar.value;
                icon.classList.add("read");
                icon.classList.remove("not-read");
                updatePopup();
                dialogCalendar.close();
                filter();
                sortBooks();
            }
        };

        inputCalendar.addEventListener("change", handleDateChange, { once: true });
    } else {
        book.status = "not read";
        book.dateFinished = null;
        icon.classList.add("not-read")
        icon.classList.remove("read");
        updatePopup();
        filter();
        console.log(inputCalendar.value);
    }

    inputCalendar.value = "";
}

sortBooks();
addAllBookCards();

btnDelete.disabled = true;

btnNewBook.addEventListener("click", () => {
    dialogNew.showModal();
})

inputStatus.addEventListener("change", () => {
    statusCheck();
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBookToMyLibrary();
    sortBooks();
    addAllBookCards();
    filter();
    dialogNew.close();
    resetForm();
})

btnCancel.addEventListener("click", () => {
    dialogNew.close();
    resetForm();
})

sortDropdown.addEventListener("change", () => {
    sortBooks();
    filter();
})

radioAscending.addEventListener("change", () => {
    sortBooks();
    filter();
})

radioDescending.addEventListener("change", () => {
    sortBooks();
    filter();
})

radioAll.addEventListener("change", filter);
radioRead.addEventListener("change", filter);
radioNotRead.addEventListener("change", filter);

btnSelect.addEventListener("click", showCheckboxes);
btnSelectAll.addEventListener("click", (e) => {
    showCheckboxes();
    selectAll(e);
});   

btnDelete.addEventListener("click", () => {
    deleteDialog();
});

btnDeleteYes.addEventListener("click", () => {
    deleteSelected();
    dialogDelete.close();
});

btnDeleteNo.addEventListener("click", () => {
    dialogDelete.close();
});