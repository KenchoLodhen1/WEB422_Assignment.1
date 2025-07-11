const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

router.get('/', async (req, res, next) => {
    try {
        const transactions = await Transaction.find()
            .populate('bookId', 'title author isbn')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        next(error);
    }
});

router.post('/borrow', async (req, res, next) => {
    try {
        const { bookId, borrowerName, borrowerEmail, borrowDays = 14 } = req.body;

        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                error: 'No copies available for borrowing'
            });
        }

        // Check if user already has this book borrowed
        const existingTransaction = await Transaction.findOne({
            bookId,
            borrowerEmail,
            status: 'borrowed'
        });

        if (existingTransaction) {
            return res.status(400).json({
                success: false,
                error: 'You have already borrowed this book'
            });
        }

        // Calculate due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + borrowDays);

        // Create transaction
        const transaction = await Transaction.create({
            bookId,
            borrowerName,
            borrowerEmail,
            dueDate
        });

        // Update book availability
        book.availableCopies -= 1;
        await book.save();

        // Populate book details for response
        await transaction.populate('bookId', 'title author isbn');

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
});

router.post('/return', async (req, res, next) => {
    try {
        const { transactionId } = req.body;

        // Find the transaction
        const transaction = await Transaction.findById(transactionId)
            .populate('bookId', 'title author isbn');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        if (transaction.status === 'returned') {
            return res.status(400).json({
                success: false,
                error: 'Book has already been returned'
            });
        }

        // Update transaction
        transaction.returnDate = new Date();
        transaction.status = 'returned';
        await transaction.save();

        // Update book availability
        const book = await Book.findById(transaction.bookId);
        book.availableCopies += 1;
        await book.save();

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        next(error);
    }
});

router.get('/user/:email', async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            borrowerEmail: req.params.email,
            status: 'borrowed'
        }).populate('bookId', 'title author isbn');

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;