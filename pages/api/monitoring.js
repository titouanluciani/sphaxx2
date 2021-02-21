require('dotenv').config()
const puppeteer = require('puppeteer')
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret:process.env.FAUNA_SECRET_KEY })

export default function(req,res){
    console.log(req.body)
    
    res.statusCode = 200
}