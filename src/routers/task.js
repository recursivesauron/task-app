const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    try{
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    }
    catch(e) {
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).send(tasks)
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        
        if(!task){
            return res.status(404).send()
        }

        res.status(200).send(task)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOpertation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOpertation){
        return res.status(400).send({ Error: 'Attempting to update invalid fields'})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }

        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            res.status(404).send()
        }

        res.status(200).send(task)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router