const {MongoClient, ObjectID} = require('mongodb')
const chalk = require('chalk')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database')
    }

    console.log(chalk.green('Successfully connected client'))

    const db = client.db(databaseName)

    db.collection('users').deleteMany({ 
        age: 27
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})