const express = require('express')//imports
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Employee = require('./models/employee.model.js')
const Role = require('./models/role.model.js')

const port = 4567//starter variables
const statuses = ['employed', 'fired']
const app = express()

mongoose.connect("mongodb+srv://abidrahman6004:XIskuzCb5VpLBXVz@backenddb.7jcyy7v.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB").then(() => {//connecting
    console.log("Connected")
    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(bodyParser.urlencoded({ extended: false}))//bodyParser
app.unsubscribe(bodyParser.json())

app.get("/", (req, res) => {//default url
    res.send("API for Employee Management System")
})

app.get("/employees/total", async (req, res) => {//get all employees
    try {
        const employee = await Employee.find({})
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/employees/search", async (req, res) => {//get employees by employeeId or name
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

app.get("/employees/:id", async (req, res) => {//get employee by built-in id
    try {
        const { id } = req.params
        const employee = await Employee.findById(id)
        console.log(employee)
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post("/employees", async (req, res) => {//post employee data
    try {
        const roles = await Role.find({}).select('name')
        const roleNames = roles.map(role => role.name);
        if (!roleNames.includes(req.body.role)) {
            return res.status(400).json({message: "Role does not exist"})
        }
        const { employeeId } = req.body
        const employeeCheck = await Employee.findOne({ employeeId: employeeId })
        if (employeeCheck){
            return res.status(400).json({message: "Employee with ID number already exists"})
        }
        const employee = await Employee.create(req.body)
        res.status(200).json(employee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get("/roles", async (req, res) => {//get all roles
    try {
        const role = await Role.find({})
        res.status(200).json(role)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post("/roles", async (req, res) => {//post role data
    try {
        const { name, roleId } = req.body
        const nameCheck = await Role.findOne({ name: name })
        if (nameCheck) {
            return res.status(400).json({message: "This role already exists"})
        }
        const idCheck = await Role.findOne({ roleId: roleId })
        if (idCheck) {
            return res.status(400).json({message: "Role with this id already exists"})
        }
        const role = await Role.create(req.body)
        res.status(200).json(role)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete("/roles/:id", async (req, res) => {//delete role
    try {
        const { id } = req.params
        let role = await Role.findById(id, req.body)
        if (!role) {
            return res.status(404).json({message: "Role not found"})
        }
        role = await Role.findByIdAndDelete(id, req.body)
        res.status(200).json({message: "Role deleted successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id/role-assign", async (req, res) => {//assign role to employee
    try {
        const roles = await Role.find({}).select('name')
        const roleNames = roles.map(role => role.name);
        if (!roleNames.includes(req.body.role)) {
            return res.status(400).json({message: "Role does not exist"})
        }
        const { id } = req.params
        const { role } = req.body
        let employee = await Employee.findById(id, { role: role })
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        employee = await Employee.findByIdAndUpdate(id, { role: role })
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id/status-update", async (req, res) => {//update employee status
    try {
        const { id } = req.params
        const { status } = req.body
        let employee = await Employee.findById(id, { status: status })
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        } else if (!statuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"})
        }
        employee = await Employee.findByIdAndUpdate(id, { status: status })
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.put("/employees/:id", async (req, res) => {//update employee data
    try {
        const { id } = req.params
        const { employeeId, status, role } = req.body
        const roles = await Role.find({}).select('name')
        const roleNames = roles.map(role => role.name);
        const employeeCheck = await Employee.findOne({ employeeId: employeeId })
        let employee = await Employee.findById(id, req.body)
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        } else if (employeeCheck) {
            return res.status(400).json({message: "Employee with ID number already exists"})
        } else if (!statuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"})
        } else if (!roleNames.includes(role)) {
            return res.status(400).json({message: "Role does not exist"})
        }
        employee = await Employee.findByIdAndUpdate(id, req.body)
        const updatedEmployee = await Employee.findById(id)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete("/employees/:id", async (req, res) => {//delete employee
    try {
        const { id } = req.params
        let employee = await Employee.findById(id, req.body)
        if (!employee) {
            return res.status(404).json({message: "Employee not found"})
        }
        employee = await Employee.findByIdAndDelete(id, req.body)
        res.status(200).json({message: "Employee deleted successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
