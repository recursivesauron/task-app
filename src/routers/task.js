const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    }
    catch(e) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate()
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.status(200).send(task)
    }catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOpertation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOpertation){
        return res.status(400).send({ Error: 'Attempting to update invalid fields'})
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        if(!task){
            return res.status(404).send()
        }

        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        
        if(!task){
            res.status(404).send()
        }
        
        res.status(200).send(task)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router