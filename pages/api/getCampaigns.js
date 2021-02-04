const axios = require('axios')
require('dotenv').config()
const formattedResponse = require('./utils/formattedResponse')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    if(process.env.USER_URL){
        //console.log(JSON.parse(req.body))
        //console.log(JSON.parse(req.body).user_url)
        const userUrl = process.env.USER_URL //JSON.parse(req.body).user_url
        const campaigns = await client.query(Map(
            Paginate(Match(
                Index('campaigns_by_user'),userUrl
            )), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        console.log("cammmpaign  : ",campaigns)
        console.log("cammmpaign  : ",campaigns.data)
        res.statusCode = 200;
        res.json(campaigns.data)
    }else{
        const user_secret = process.env.USER_SECRET
        console.log("user secret getcamp : ", user_secret)
        const userClient = new faunadb.Client({ secret:user_secret })
        const ci = await userClient.query(Select(['data','url'],Get(CurrentIdentity())))
        console.log(ci)
        const campaigns = await userClient.query(Map(
            Paginate(Match(
                Index('campaigns_by_user'),Select(['data','url'], Get(CurrentIdentity()))
            )), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        console.log(campaigns)
        res.statusCode = 200;
        res.json(campaigns)
    }
}