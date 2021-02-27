const mongoose = require('mongoose')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})

// const andrew = new User({name: 'Mike', email: "mike@hotmail.com", password: "asdfasdf"})
// andrew.save().then(() => {
//     console.log(andrew)
// }).catch((error) => {
//     console.log('Error:' + error)
// })

// const newTask = new Task({description: "Some new task for mongoose", completed: false})
// newTask.save().then(()=> {
//     console.log(newTask)
// }).catch((error) => {
//     console.log(error)
// })
