const mongoose = require('mongoose')
const connectionURL = process.env.MONGO_URL

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
