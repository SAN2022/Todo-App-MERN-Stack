const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

// let todos = []

mongoose.connect(process.env.MONGODB_URL)

.then(()=> {
    console.log('DB Connected')
})
.catch((err)=> {
    console.log(err)
})

//Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description : String,
})

//Creating Model
const todoModel = mongoose.model('Todo', todoSchema)

app.post('/todos', async (req, res)=> {
    const {title, description} = req.body
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // }
    // todos.push(newTodo)
    // console.log(todos)

    try{
        const newTodo = new todoModel({title, description})
        await newTodo.save()
        res.status(201).json(newTodo) 
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
})

app.get('/todos', async (req, res)=> {
    try{
        const todos = await todoModel.find()
        res.json(todos)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

//Update a Todo Item
app.put('/todos/:id', async (req, res)=> {
    try{
        const {title, description} = req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, {title, description}, { new: true } 
        )

        if(!updatedTodo){
            return res.status(404).json({ message: 'Todo not found'})
        }
        res.json(updatedTodo)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

//Delete a Todo Item
app.delete('/todos/:id', async (req, res)=> {
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }   
})

app.listen(8000, ()=> {
    console.log('Server is running!')
})