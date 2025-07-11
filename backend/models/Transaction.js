const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book ID is required']
    },
    borrowerName: {
        type: String,
        required: [true, 'Borrower name is required'],
        trim: true
    },
    borrowerEmail: {
        type: String,
        required: [true, 'Borrower email is required'],
        trim: true,
        lowercase: true
    },
    borrowDate: {
        type: Date,
        required: [true, 'Borrow date is required'],
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned', 'overdue'],
        default: 'borrowed'
    }
}, {
    timestamps: true
});

// Index for efficient queries
transactionSchema.index({ bookId: 1, status: 1 });
transactionSchema.index({ borrowerEmail: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);