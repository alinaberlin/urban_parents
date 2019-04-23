const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    age: Number,
    gender: String,
    language: String,
    nationality: String,
    location: {
        type: {
            String,
            enum: ["Point"],
            default: "Point"
        },
        Coordinates: {
            type: [Number]
        },
        Address: {
            type: String
        },
        Postcode: {
            type: Number
        },
        City: {
            type: String
        },
        Country: {
            type: String
        }
    },
    occupation: String,
    picture: String,
    password: {
        required: true,
        type: String
    },
    child: [{ type: Schema.Types.ObjectId, ref: "Child" }],
    activity: [{ type: Schema.Types.ObjectId, ref: "Activity" }]
});

const Parent = mongoose.model("Parent", parentSchema);
module.exports = Parent;
