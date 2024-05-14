const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        employeeId: {
            type: Number,
            required: true
        },

        role: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
            enum: ['employed', 'fired']
        }
    },
    {
        timestamps: true
    }
)

const Employee = mongoose.model("Employee", EmployeeSchema)

module.exports = Employee