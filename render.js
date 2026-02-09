import { LibraryStore } from './libraryStore.js';

// --- STRATEGIES (OCP) ---
const SortStrategies = {
    title: (isAsc) => (a, b) => isAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
    "date-added": (isAsc) => (a, b) => isAsc ? a.dateAdded - b.dateAdded : b.dateAdded - a.dateAdded,
    "date-finished": (isAsc) => (a, b) => {
        if (!a.dateFinished) return 1;
        if (!b.dateFinished) return -1;
        return isAsc ? a.dateFinished.localeCompare(b.dateFinished) : b.dateFinished.localeCompare(a.dateFinished);
    }
};

const FilterStrategies = {
    all: () => true,
    read: (book) => book.status === "read",
    "not-read": (book) => book.status === "not read",
};

export class Renderer {
    constructor(elements, eventHandlers) {
        this.elements = elements;
        this.eventHandlers = eventHandlers;
    }

    render() {
        const sortBy = this.elements.sortSelect.value;
        const isAsc = this.elements.radioAscending.checked;
        const filterBy = this.elements.radioAll.checked ? 'all' : 
                         this.elements.radioRead.checked ? 'read' : 'not-read';

        const booksToDisplay = LibraryStore.getProcessedBooks(
            SortStrategies[sortBy](isAsc),
            FilterStrategies[filterBy]
        );

        this.elements.container.innerHTML = booksToDisplay.map(book => this._createCardHTML(book)).join('');
        
        this._attachCardListeners();
        this.updateDeleteButtonState();
    }

    _createCardHTML(book) {
        return `
            <div class="card-wrapper" data-id="${book.id}">
                <div class="options-wrapper">
                    <button type="button" class="read-icon ${book.status.replace(' ', '-')}" data-id="${book.id}"></button>
                    <input type="checkbox" class="card-checkbox" data-id="${book.id}">
                </div>
                <div class="card" style="--card-tint: ${book.coverColor}">
                    <h2 class="card-title">${book.title}</h2>
                    <div class="pop-up">
                        <p><span>Author:</span> ${book.author}</p>
                        <p><span>Pages:</span> ${book.pages}</p>
                        <p><span>Status:</span> ${book.status}</p>
                        ${book.dateFinished ? `<p><span>Finished:</span> ${book.dateFinished}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    _attachCardListeners() {
        // Read status icons
        document.querySelectorAll(".read-icon").forEach(btn => {
            btn.addEventListener("click", (e) => this.eventHandlers.onReadStatusToggle(e.target));
        });

        // Checkboxes
        document.querySelectorAll(".card-checkbox").forEach(cb => {
            cb.addEventListener("change", () => this.updateDeleteButtonState());
        });
    }

    updateDeleteButtonState() {
        const checkboxes = document.querySelectorAll(".card-checkbox");
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        this.elements.btnDelete.disabled = !anyChecked;
    }

    showCheckboxes() {
        document.querySelectorAll(".card-checkbox").forEach(cb => cb.classList.add("visible"));
    }

    hideCheckboxes() {
        document.querySelectorAll(".card-checkbox").forEach(cb => {
            cb.classList.remove("visible");
            cb.checked = false;
        });
        this.updateDeleteButtonState();
    }

    getSelectedIds() {
        const checkboxes = document.querySelectorAll(".card-checkbox");
        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.id);
    }
}