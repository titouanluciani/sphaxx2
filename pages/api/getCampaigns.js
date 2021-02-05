const axios = require('axios')
require('dotenv').config()
const formattedResponse = require('./utils/formattedResponse')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

const userAuth = require('./userAuth')
const authSecret = userAuth.authSecret

export default async (req, res) => {
    

        //const user_secret = process.env.USER_SECRET
        console.log("req getcamp : ", req.body)
        console.log("req getcamp : ", JSON.parse(req.body))
        const user_url = JSON.parse(req.body)
        console.log("user_url getcamp : ", user_url)
        console.log("user_url getcamp typeof : ", typeof user_url)

        const user_secret = await client.query(
            Select(
                ['data', 'token', 'secret'],
                Get(
                    Match(
                        Index('tokens_by_url'),
                        user_url
                    )
                )
            )
        )
        console.log("get camp :: this is user secret : ",user_secret)

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