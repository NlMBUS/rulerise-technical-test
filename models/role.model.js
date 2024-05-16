const mongoose = require('mongoose')//schema for role
const RoleSchema = new mongoose.Schema( 
    {
        name: {
            type: String,
            required: true
        },

        roleId: {
            type: Number,
            required: true
        }
    }
)

const Role = mongoose.model("Role", RoleSchema)

module.exports = Role