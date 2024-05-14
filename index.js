const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Employee = require('./models/employee.model.js')
const port = 4567
var roles = ['manager', 'developer', 'design', 'scrum master'];
mongoose.connect("mongodb+srv://abidrahman6004:XIskuzCb5VpLBXVz@backenddb.7jcyy7v.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB").then(() => {
    console.log("ADFX")
    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


const app = express()
app.use(bodyParser.urlencoded({ extended: false}))

app.unsubscribe(bodyParser.json())


app.get("/", (req, res) => {
    // Employee.find((err, employees) => {
    //     res.json(employee)
    // })
    res.send("GRRG")
})



// app.get("/employees/:id", (req, res) => {
//     Employee.findById(req.params.id, (err, employee) => {
//         res.json(employee)
//     })
//     res.send(`${req.params.id}`)
// })

app.get("/employees", async (req, res) => {
    try {
        const employee = await Employee.find({})
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/search", async (req, res) => {
    try {
        const { name } = req.query;
        var employee = await Employee.findOne({ name: name })
        if (!employee) {
            const { employeeId } = req.query
            employee = await Employee.findOne({ employeeId: employeeId })
            if (!employee) {
                return res.status(404).json({message: "Employee not found"})
            }
        }
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/dashboard/total-employees", async (req, res) => {
    try {
        const employee = await Employee.find({})
        res.status(200).json(employee.length)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/dashboard/available-roles", (req, res) => {
    try {
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/dashboard/add-role", async (req, res) => {
    try {
        const { role } = req.query
        await Employee.findOne({ role: role })
        roles.push(role)
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/dashboard/remove-role", async (req, res) => {
    try {
        const { role } = req.query
        await Employee.findOne({ role: role })
        if (!roles.includes(role)) {
            return res.status(404).json({message: "Role not found"})
        } else {
            roles.pop(role)
            res.status(200).json(roles)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params
        const employee = await Employee.findById(id)
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post("/employees", async (req, res) => {
    try {
        if (!roles.includes(req.body.role)) {
            return res.status(400).json({message: "Role does not exist"})
        }
        const employee = await Employee.create(req.body)
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id/role-assign", async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        const employee = await Employee.findByIdAndUpdate(id, { role: role })
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id/status-update", async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const employee = await Employee.findByIdAndUpdate(id, { status: status })
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params
        const employee = await Employee.findByIdAndUpdate(id, req.body)
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params
        const employee = await Employee.findByIdAndDelete(id, req.body)
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        res.status(200).json({message: "Employee deleted successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// app.post("/employees/:id", (req, res) => {
//     console.log(`${req.params.id}`)
//     console.log(req.body)
// })

// app.post("/employees/:id", (req, res) => {
//     console.log(`${req.params.id}`)
//     console.log(req.body)
// })

