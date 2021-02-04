const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Create, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log(JSON.parse(req.body))
    const campaignName = JSON.parse(req.body).name

    const user_secret = process.env.USER_SECRET
    console.log("user secret getcamp : ", user_secret)
    const userClient = new faunadb.Client({ secret:user_secret })

    const ci = await userClient.query(Select(['data','url'],Get(CurrentIdentity())))
    
    const newCampaign = await userClient.query(Create(
        Collection('Campaigns'),
        { data : { name:  campaignName , userUrl : Select(['data','url'], Get(CurrentIdentity())) } }
    ))

    console.log(newCampaign)
    res.statusCode = 200;
    res.json(newCampaign)
}