const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true
    },
    publishedYear: {
        type: Number,
        required: [true, 'Published year is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true
    },
    totalCopies: {
        type: Number,
        required: [true, 'Total copies is required'],
        min: 1
    },
    availableCopies: {
        type: Number,
        required: [true, 'Available copies is required'],
        min: 0
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Ensure available copies doesn't exceed total copies
bookSchema.pre('save', function(next) {
    if (this.availableCopies > this.totalCopies) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);