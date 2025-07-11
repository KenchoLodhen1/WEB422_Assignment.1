// API Base URL
const API_BASE_URL = window.location.origin;

// Global variables
let books = [];
let transactions = [];
let currentEditingBook = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    loadTransactions();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Book form submission
    document.getElementById('bookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveBook();
    });

    // Borrow form submission
    document.getElementById('borrowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        borrowBook();
    });

    // Return form submission
    document.getElementById('returnForm').addEventListener('submit', function(e) {
        e.preventDefault();
        loadUserBooks();
    });
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    document.getElementById(sectionName + 'Section').style.display = 'block';

    // Update navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load data for specific sections
    if (sectionName === 'books') {
        loadBooks();
    } else if (sectionName === 'transactions') {
        loadTransactions();
    } else if (sectionName === 'borrow') {
        loadAvailableBooks();
    }
}

// Alert functions
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Book management functions
async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books`);
        const data = await response.json();
        
        if (data.success) {
            books = data.data;
            renderBooksTable();
        } else {
            showAlert('Error loading books', 'danger');
        }
    } catch (error) {
        console.error('Error loading books:', error);
        showAlert('Error loading books', 'danger');
    }
}

function renderBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><span class="badge bg-info">${book.genre}</span></td>
            <td>
                <span class="badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}">
                    ${book.availableCopies}/${book.totalCopies}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editBook('${book._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBook('${book._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function clearBookForm() {
    document.getElementById('bookForm').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('bookModalTitle').textContent = 'Add New Book';
    currentEditingBook = null;
}

async function saveBook() {
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookIsbn').value,
        genre: document.getElementById('bookGenre').value,
        publishedYear: parseInt(document.getElementById('bookYear').value),
        totalCopies: parseInt(document.getElementById('bookCopies').value),
        description: document.getElementById('bookDescription').value
    };

    const bookId = document.getElementById('bookId').value;
    
    try {
        let response;
        if (bookId) {
            // Update existing book
            response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });
        } else {
            // Create new book
            response = await fetch(`${API_BASE_URL}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData)
            });
        }

        const data = await response.json();
        
        if (data.success) {
            showAlert(`Book ${bookId ? 'updated' : 'created'} successfully!`, 'success');
            loadBooks();
            bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide();
        } else {
            showAlert(data.error || 'Error saving book', 'danger');
        }
    } catch (error) {
        console.error('Error saving book:', error);
        showAlert('Error saving book', 'danger');
    }
}

async function editBook(bookId) {
    const book = books.find(b => b._id === bookId);
    if (!book) return;

    // Populate form with book data
    document.getElementById('bookId').value = book._id;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookIsbn').value = book.isbn;
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('bookYear').value = book.publishedYear;
    document.getElementById('bookCopies').value = book.totalCopies;
    document.getElementById('bookDescription').value = book.description || '';

    document.getElementById('bookModalTitle').textContent = 'Edit Book';
    currentEditingBook = book;

    // Show modal
    new bootstrap.Modal(document.getElementById('bookModal')).show();
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert('Book deleted successfully!', 'success');
            loadBooks();
        } else {
            showAlert(data.error || 'Error deleting book', 'danger');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showAlert('Error deleting book', 'danger');
    }
}

// Transaction management functions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions`);
        const data = await response.json();
        
        if (data.success) {
            transactions = data.data;
            renderTransactionsTable();
        } else {
            showAlert('Error loading transactions', 'danger');
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        showAlert('Error loading transactions', 'danger');
    }
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const borrowDate = new Date(transaction.borrowDate).toLocaleDateString();
        const dueDate = new Date(transaction.dueDate).toLocaleDateString();
        const returnDate = transaction.returnDate ? 
            new Date(transaction.returnDate).toLocaleDateString() : 
            'Not returned';

        // Determine status badge
        let statusBadge = '';
        if (transaction.status === 'borrowed') {
            const isOverdue = new Date() > new Date(transaction.dueDate);
            statusBadge = isOverdue ? 
                '<span class="badge status-overdue">Overdue</span>' :
                '<span class="badge status-borrowed">Borrowed</span>';
        } else {
            statusBadge = '<span class="badge status-returned">Returned</span>';
        }

        row.innerHTML = `
            <td>
                <strong>${transaction.bookId.title}</strong><br>
                <small class="text-muted">by ${transaction.bookId.author}</small>
            </td>
            <td>
                <strong>${transaction.borrowerName}</strong><br>
                <small class="text-muted">${transaction.borrowerEmail}</small>
            </td>
            <td>${borrowDate}</td>
            <td>${dueDate}</td>
            <td>${returnDate}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(row);
    });
}

// Borrow/Return functions
async function loadAvailableBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('borrowBookSelect');
            select.innerHTML = '<option value="">Choose a book...</option>';
            
            data.data.forEach(book => {
                if (book.availableCopies > 0) {
                    const option = document.createElement('option');
                    option.value = book._id;
                    option.textContent = `${book.title} by ${book.author} (${book.availableCopies} available)`;
                    select.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error loading available books:', error);
        showAlert('Error loading available books', 'danger');
    }
}

async function borrowBook() {
    const borrowData = {
        bookId: document.getElementById('borrowBookSelect').value,
        borrowerName: document.getElementById('borrowerName').value,
        borrowerEmail: document.getElementById('borrowerEmail').value,
        borrowDays: parseInt(document.getElementById('borrowDays').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(borrowData)
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert('Book borrowed successfully!', 'success');
            document.getElementById('borrowForm').reset();
            loadAvailableBooks();
            loadBooks();
        } else {
            showAlert(data.error || 'Error borrowing book', 'danger');
        }
    } catch (error) {
        console.error('Error borrowing book:', error);
        showAlert('Error borrowing book', 'danger');
    }
}

async function loadUserBooks() {
    const email = document.getElementById('returnEmail').value;
    if (!email) {
        showAlert('Please enter your email address', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions/user/${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (data.success) {
            const container = document.getElementById('userBooksContainer');
            const booksList = document.getElementById('userBooksList');
            
            if (data.data.length === 0) {
                booksList.innerHTML = '<p class="text-muted">No borrowed books found.</p>';
            } else {
                booksList.innerHTML = '';
                data.data.forEach(transaction => {
                    const bookItem = document.createElement('div');
                    bookItem.className = 'user-book-item';
                    
                    const dueDate = new Date(transaction.dueDate);
                    const isOverdue = new Date() > dueDate;
                    
                    bookItem.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${transaction.bookId.title}</strong><br>
                                <small class="text-muted">by ${transaction.bookId.author}</small><br>
                                <small class="text-muted">Due: ${dueDate.toLocaleDateString()}</small>
                                ${isOverdue ? '<span class="badge bg-danger ms-2">Overdue</span>' : ''}
                            </div>
                            <button class="btn btn-sm btn-success" onclick="returnBook('${transaction._id}')">
                                <i class="fas fa-undo"></i> Return
                            </button>
                        </div>
                    `;
                    booksList.appendChild(bookItem);
                });
            }
            
            container.style.display = 'block';
        } else {
            showAlert(data.error || 'Error loading user books', 'danger');
        }
    } catch (error) {
        console.error('Error loading user books:', error);
        showAlert('Error loading user books', 'danger');
    }
}

async function returnBook(transactionId) {
    if (!confirm('Are you sure you want to return this book?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/transactions/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactionId })
        });

        const data = await response.json();
        
        if (data.success) {
            showAlert('Book returned successfully!', 'success');
            loadUserBooks();
            loadBooks();
            loadTransactions();
        } else {
            showAlert(data.error || 'Error returning book', 'danger');
        }
    } catch (error) {
        console.error('Error returning book:', error);
        showAlert('Error returning book', 'danger');
    }
}