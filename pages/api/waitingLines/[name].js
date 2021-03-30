const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query


const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query
//const user_secret = authSecret //process.env.USER_SECRET
//console.log("user secret getprospects : ", user_secret)

export default async (req, res) => {
    
        console.log(req.query)
        console.log("waitingLine [name] body : ",req.body)
        const campaign = req.query.name
        console.log(campaign)
        const user_url = JSON.parse(req.body)
        console.log("user secret from cookie in [name]  :",user_url)

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
        
        const waitingLine = await userClient.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('waitingLine_by_campaign'), campaign),
                    Match(
                        Index('waitingLine_by_done'), false),
                    Match(
                        Index('waitingLine_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                )
    
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        
        console.log(campaign)
        res.statusCode = 200;
        res.json({waitingLine})

}