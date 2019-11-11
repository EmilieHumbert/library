const myLibrary = [];

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

function addBookToLibrary (book) {
  myLibrary.push(book);
}

function render() {
  // Create new table content
  const virtualContent = document.createElement('tbody');

  // Update table
  myLibrary.forEach((book, index) => {

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
    Object.assign(deleteButton, {
      type: 'button',
      value: 'Delete',
      onclick: () => {
        myLibrary.splice(index, 1);
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

// get checkbox value
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

// clear the form
function clearForm () {
  setFieldValue('book-title', '');
  setFieldValue('book-author', '');
  setFieldValue('book-pages', '');
  setFieldValue('book-read', false);
}

function addBook () {
  const title = getFieldValue('book-title');
  const author = getFieldValue('book-author');
  const pageNumber = getFieldValue('book-pages');
  const read = getFieldValue('book-read');
  const book = new Book(title, author, pageNumber, read);

  addBookToLibrary(book);
  render();
  clearForm();
}

// Create example
const keeper = new Book('Keeper of lost things', 'Ruth Hogan', 244, true);
addBookToLibrary(keeper);
render();

// Pop-up form
// Get the modal
const modal = document.getElementById('addBookModal');

// Get the button that opens the modal
const newBookButton = document.getElementById('newBook');

// Get the <span> element that closes the modal
const closeButton = document.getElementById('closeModal');

// When the user clicks on the button, open the modal
newBookButton.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}
