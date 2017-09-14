var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var linkSchema = new Schema({

    title: String,
    alert: { type: Boolean, default: true },
    keywords: { type: Array, default: [] },
    categories: { type: Array, default: [] },
    sources: { type: Array, default: [] },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: Date.now },
    user: {
        userid: String,
        username: String,
        email: String
    }
});

module.exports = mongoose.model('Link', linkSchema);