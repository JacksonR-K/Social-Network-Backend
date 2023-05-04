const { Schema } = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 200,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: dayjs().format("YYYY-MM-DD"),
        }
    }
);

module.exports = reactionSchema;