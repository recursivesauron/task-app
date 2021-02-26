const mongoose = require('mongoose')
const validator = require('validator')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email provided.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 6){
                throw new Error('Password must be at least 6 characters')
            }
            else if(value.includes('password')){
                throw new Error('Your password can\'t contain \'password\'')
            }
        }

    }
})

const  Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const andrew = new User({name: 'Mike', email: "mike@hotmail.com", password: "asdfasdf"})
andrew.save().then(() => {
    console.log(andrew)
}).catch((error) => {
    console.log('Error:' + error)
})

// const newTask = new Task({description: "Some new task for mongoose", completed: false})
// newTask.save().then(()=> {
//     console.log(newTask)
// }).catch((error) => {
//     console.log(error)
// })
