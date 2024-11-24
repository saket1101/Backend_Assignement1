const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                addedAt: { type: Date, default: Date.now },

            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Team', TeamSchema);
