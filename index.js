const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Employee = require('./models/employee.model.js')
const port = 4567
var roles = ['manager', 'developer', 'design', 'scrum master']
const statuses = ['employed', 'fired']
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
    res.send("API for Employee Management System")
})

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
        const { name, employeeId } = req.query
        if (employeeId) {
            const idEmployee = await Employee.findOne({ employeeId: employeeId })
            if (idEmployee) {
                return res.status(200).json(idEmployee)
            }
        }
        if (name) {
            const nameEmployee = await Employee.find({ name: { $regex: `^${name}$`, $options: 'i' } })
            if (nameEmployee.length > 0) {
                return res.status(200).json(nameEmployee)
            }
        }
        return res.status(404).json({ message: "Employee not found" })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/total-employees", async (req, res) => {
    try {
        const employee = await Employee.find({})
        res.status(200).json(employee.length)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/available-roles", (req, res) => {
    try {
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/add-role", async (req, res) => {
    try {
        const { role } = req.query
        await Employee.findOne({ role: role })
        roles.push(role)
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/remove-role", async (req, res) => {
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
        console.log(employee)
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
        const { employeeId } = req.body
        const employeeCheck = await Employee.findOne({ employeeId: employeeId })
        if (employeeCheck){
            console.log(employeeCheck)
            return res.status(400).json({message: "Employee with ID number already exists"})
        } else {
            const employee = await Employee.create(req.body)
            res.status(200).json(employee)
        }
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
        res.status(200).json(employee)
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
        } else if (!statuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"})
        }
        res.status(200).json(employee)
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
        res.status(200).json(employee)
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
