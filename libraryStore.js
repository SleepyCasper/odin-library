import { Book } from './book.js';

export const LibraryStore = {
    books: [
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
    ],

    add(book) {
        this.books.push(book);
    },

    updateStatus(id, newStatus, date = null) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.status = newStatus;
            book.dateFinished = date;
        }
    },

    removeSelected(ids) {
        this.books = this.books.filter(book => !ids.includes(book.id));
    },

    // Open/Closed: Pass any logic (sort or filter) as a function
    getProcessedBooks(sortStrategy, filterStrategy) {
        let list = [...this.books];
        if (filterStrategy) list = list.filter(filterStrategy);
        if (sortStrategy) list.sort(sortStrategy);
        return list;
    }
};