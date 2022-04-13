const Datastore = require('nedb')
const path = require('path')

const defaults = {
    name : 'database',
}

// mogłem tutaj użyć dziedziczenia

class Database {
    constructor (name = undefined){
        let filename = undefined
        try {filename = path.basename(name, path.extname(name)) + '.db'} catch{}
        this.name = name || defaults.name 
        this.db = new Datastore({
            filename : filename || 'database.db',
            autoload : true,
        })
        console.table(this.db)
        // this.get = {
        //     all : (callback) =>{
        //         this.db.find({}, callback)
        //     }
        // }
        this.last = {
            id : ''
        }
        // this.get = {
        //     last : async () =>{
        //         await this.db.count({}, async (err, count) =>{
        //             await this.db.findOne({ id : this.last.id }, (error, doc) =>{

        //             })
        //         })
        //     }
        // }
    }

    insert(data, callback){
        this.db.insert(data, callback)
    }
    count(callback){
        this.db.count({}, callback)
        // const count = this.db.count
        // let result
        // = async count({}, async (err, number)=>{
        //     result = await number
        //     console.log(number, result)
        // })
        // return result
    }
    get(critetion, callback){
        this.db.findOne(critetion, callback)
    }
    getAll( critetion, callback ) {
        this.db.find(critetion, callback)
    }
}

module.exports = Database

// console.log(new Database('XD'))