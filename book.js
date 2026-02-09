export class Book {
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

  get id() { return this.#id; }
  get dateAdded() { return this.#dateAdded; }
}