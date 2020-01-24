// Check local storage
function storageAvailable(type) {
  let storage;
  try {
    const x = '__storage_test__';
    storage = window[type];
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}

function updateLibraryStore (books) {
  if (storageAvailable('localStorage')) {
    window.localStorage.setItem('myLibrary', JSON.stringify(books));
  }
}

class Library {
  constructor(){
    this.books = [];
  };
  
  addBook (book) {
    this.books.push(book);
    updateLibraryStore(this.books);
  }

  removeBook (index) {
    this.books.splice(index, 1);
    updateLibraryStore(this.books);
  }
}

class Book {
  constructor(title, author, pageNumber, read) {
    this.title = title;
    this.author = author;
    this.pageNumber = pageNumber;
    this.read = read;
  }

  info () {
    return `${this.title} by ${this.author}, ${this.pageNumber} pages, ${this.read}`;
  }
}

function render() {
  // Create new table content
  const virtualContent = document.createElement('tbody');

  // Update table
  myLibrary.books.forEach((book, index) => {
    // Create row
    const row = virtualContent.insertRow(0);

    // Create cells
    const titleCell = row.insertCell(0);
    const authorCell = row.insertCell(1);
    const pageNumberCell = row.insertCell(2);
    const readCell = row.insertCell(3);
    const deleteCell = row.insertCell(4);

    // Update cells
    titleCell.innerHTML = book.title;
    authorCell.innerHTML = book.author;
    pageNumberCell.innerHTML = book.pageNumber;

    // Add read button on the page
    const readBtnLabel = document.createElement('label');
    readBtnLabel.setAttribute('class', 'switch');
    const readBtnInput = document.createElement('input');
    readBtnInput.setAttribute('type', 'checkbox');
    readBtnInput.addEventListener('change', function (event) {
      book.read = event.target.checked;
      updateLibraryStore();
    });
    if (book.read) {
      readBtnInput.setAttribute('checked', 'checked');
    }
    const readBtnSpan = document.createElement('span');
    readBtnSpan.setAttribute('class', 'slider');
    readBtnLabel.appendChild(readBtnInput);
    readBtnLabel.appendChild(readBtnSpan);
    readCell.appendChild(readBtnLabel);

    // Add delete button
    const deleteButton = document.createElement('input');
    deleteButton.setAttribute('class', 'medium material-icons');
    Object.assign(deleteButton, {
      type: 'button',
      value: 'delete',
      onclick: () => {
        myLibrary.removeBook(index);
        render();
      },
    });
    deleteCell.appendChild(deleteButton);
  });

  // Select current table content
  const tableContent = document.querySelector('#sample-table tbody');

  // Update table content
  tableContent.replaceWith(virtualContent);
}

// Get checkbox value
function isCheckbox (field) {
  return field.getAttribute('type') === 'checkbox';
}

function getFieldValue (elementId) {
  const field = document.getElementById(elementId);
  if (isCheckbox(field)) {
    return field.checked;
  }
  return field.value;
}

function setFieldValue (elementId, newValue) {
  const field = document.getElementById(elementId);
  if (isCheckbox(field)) {
    field.checked = newValue;
  } else {
    field.value = newValue;
  }
}

// Clear the form
function clearForm () {
  setFieldValue('book-title', '');
  setFieldValue('book-author', '');
  setFieldValue('book-pages', '');
  setFieldValue('book-read', false);
}

// Add a new book
function addBook() {
  const title = getFieldValue('book-title');
  const author = getFieldValue('book-author');
  const pageNumber = getFieldValue('book-pages');
  const read = getFieldValue('book-read');
  const book = new Book(title, author, pageNumber, read);

  myLibrary.addBook(book);
  render();
  clearForm();
}

 // On submit
 const form = document.getElementById('form1');
 form.addEventListener('submit', () => addBook());

// Modal
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.modal');
  M.Modal.init(elems, {});
});

const myLibrary = new Library();

// Local storage
if (storageAvailable('localStorage')) {
  const storedLibrary = JSON.parse(window.localStorage.getItem('myLibrary'));

  if (Array.isArray(storedLibrary) && storedLibrary.length > 0) {
    storedLibrary.forEach((book) => {
      myLibrary.addBook(book);
    });
  }
}

render();
