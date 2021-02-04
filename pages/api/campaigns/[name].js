const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query
const user_secret = process.env.USER_SECRET
const userClient = new faunadb.Client({ secret:user_secret })
console.log("user secret getprospects : ", user_secret)

export default async (req, res) => {

        console.log(req)
        console.log(req.query)
        console.log(typeof req.query)
        const campaign = req.query.name
        console.log(campaign)
        
        const prospects = await userClient.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('prospects_by_campaign'), campaign),
                    Match(
                        Index('prospects_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                )
    
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        
        const notes = await userClient.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('notes_by_campaign'), campaign),
                    Match(
                        Index('notes_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                )
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        const messages = await userClient.query(Map(
            Paginate(
                Intersection(
                    Match(
                        Index('messages_by_campaign'), campaign),
                    Match(
                        Index('messages_by_user'),Select(['data','url'], Get(CurrentIdentity())))
                )
            ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
        ))
        console.log(notes)
        console.log(messages)
        console.log(campaign)
        console.log(typeof campaign)
        res.statusCode = 200;
        res.json({prospects, notes, messages})

}