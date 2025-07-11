const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res, next) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Set available copies equal to total copies for new books
        if (req.body.totalCopies && !req.body.availableCopies) {
            req.body.availableCopies = req.body.totalCopies;
        }

        const book = await Book.create(req.body);
        
        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;