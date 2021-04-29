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
        console.log("campaign [name] body : ",req.body)
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
        
        const prospects = await client.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('prospects_by_campaign'), campaign),
                    Match(
                        Index('prospects_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                ), {size : 100000}
    
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        
        const notes = await client.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('notes_by_campaign'), campaign),
                    Match(
                        Index('notes_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                ), {size : 100000}
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        const messages = await client.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('messages_by_campaign'), campaign),
                    Match(
                        Index('messages_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                ), {size : 100000}
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        console.log(notes)
        console.log(messages)
        console.log(campaign)
        console.log(typeof campaign)
        res.statusCode = 200;
        res.json({prospects, notes, messages})

}