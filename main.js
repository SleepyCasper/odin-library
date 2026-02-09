import { Book } from './book.js';
import { LibraryStore } from './libraryStore.js';
import { Renderer } from './render.js';

// --- DOM ELEMENTS ---
const elements = {
    container: document.querySelector(".wrapper-cards"),
    sortSelect: document.getElementById("sort-select"),
    radioAscending: document.getElementById("ascending"),
    radioDescending: document.getElementById("descending"),
    radioAll: document.getElementById("all"),
    radioRead: document.getElementById("read"),
    radioNotRead: document.getElementById("not-read"),
    form: document.getElementById("form"),
    dialogNew: document.getElementById("dialog-new"),
    dialogDelete: document.getElementById("dialog-delete"),
    dialogCalendar: document.getElementById("dialog-calendar-finished"),
    btnNew: document.getElementById("btn-new"),
    btnSelect: document.getElementById("btn-select"),
    btnSelectAll: document.getElementById("btn-select-all"),
    btnDelete: document.getElementById("btn-delete"),
    btnDeleteYes: document.getElementById("btn-delete-yes"),
    btnDeleteNo: document.getElementById("btn-delete-no"),
    btnCancel: document.getElementById("cancel"),
    inputTitle: document.getElementById("title"),
    inputAuthor: document.getElementById("author"),
    inputPages: document.getElementById("pages"),
    inputStatus: document.getElementById("status"),
    inputDate: document.getElementById("date"),
    dateWrapper: document.getElementById("date-wrapper"),
    inputCalendar: document.getElementById("date-finished")
};

// --- BUSINESS LOGIC ---
function handleReadStatusToggle(icon) {
    const book = LibraryStore.books.find(b => b.id === icon.dataset.id);
    
    if (book.status === "not read") {
        elements.dialogCalendar.showModal();
        
        const handleDateChange = () => {
            if (elements.inputCalendar.value !== "") {
                LibraryStore.updateStatus(book.id, "read", elements.inputCalendar.value);
                elements.dialogCalendar.close();
                elements.inputCalendar.value = "";
                renderer.render();
            }
        };

        elements.inputCalendar.addEventListener("change", handleDateChange, { once: true });
    } else {
        LibraryStore.updateStatus(book.id, "not read", null);
        renderer.render();
    }
}

function toggleSelectAll(e) {
    const checkboxes = document.querySelectorAll(".card-checkbox");
    if (e.target.textContent === "Select all") {
        checkboxes.forEach(cb => cb.checked = true);
        e.target.textContent = "Unselect all";
    } else {
        checkboxes.forEach(cb => cb.checked = false);
        e.target.textContent = "Select all";
    }

    renderer.updateDeleteButtonState();
}

function deleteSelected() {
    const idsToDelete = renderer.getSelectedIds();
    LibraryStore.removeSelected(idsToDelete);
    renderer.render();
    renderer.hideCheckboxes();
}

function statusCheck() {
    if (!elements.inputStatus.checked) {
        elements.inputStatus.value = "not read";
        elements.dateWrapper.style.display = "none";
        elements.inputDate.removeAttribute("required");
    } else {
        elements.inputStatus.value = "read";
        elements.dateWrapper.style.display = "flex";
        elements.inputDate.setAttribute("required", "");
    }
}

function resetForm() {
    elements.inputTitle.value = "";
    elements.inputAuthor.value = "";
    elements.inputPages.value = "";
    elements.inputStatus.value = "not read";
    elements.inputStatus.checked = false;
    elements.inputDate.removeAttribute("required");
    elements.inputDate.value = "";
    elements.dateWrapper.style.display = "none";
}

// --- INITIALIZE RENDERER ---
const renderer = new Renderer(elements, {
    onReadStatusToggle: handleReadStatusToggle
});

// --- EVENT LISTENERS ---
elements.btnNew.addEventListener("click", () => {
    elements.dialogNew.showModal();
});

elements.inputStatus.addEventListener("change", statusCheck);

elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const dateFinished = elements.inputStatus.checked ? elements.inputDate.value : null;
    
    const newBook = new Book(
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        elements.inputStatus.value,
        dateFinished
    );
    
    LibraryStore.add(newBook);
    renderer.render();
    elements.dialogNew.close();
    resetForm();
});

elements.btnCancel.addEventListener("click", () => {
    elements.dialogNew.close();
    resetForm();
});

// Sort and filter
elements.sortSelect.addEventListener("change", () => renderer.render());
elements.radioAscending.addEventListener("change", () => renderer.render());
elements.radioDescending.addEventListener("change", () => renderer.render());
elements.radioAll.addEventListener("change", () => renderer.render());
elements.radioRead.addEventListener("change", () => renderer.render());
elements.radioNotRead.addEventListener("change", () => renderer.render());

// Selection and deletion
elements.btnSelect.addEventListener("click", () => renderer.showCheckboxes());
elements.btnSelectAll.addEventListener("click", (e) => {
    renderer.showCheckboxes();
    toggleSelectAll(e);
});

elements.btnDelete.addEventListener("click", () => {
    elements.dialogDelete.showModal();
});

elements.btnDeleteYes.addEventListener("click", () => {
    deleteSelected();
    elements.dialogDelete.close();
});

elements.btnDeleteNo.addEventListener("click", () => {
    elements.dialogDelete.close();
});

// --- START APP ---
elements.btnDelete.disabled = true;
renderer.render();