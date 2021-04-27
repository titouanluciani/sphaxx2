const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query
const user_secret = process.env.USER_SECRET
const userClient = new faunadb.Client({ secret:user_secret })


export default async (req, res) => {
    console.log(req)
    console.log(req.query)
    const campaign = req.query.name
    console.log(campaign)

    const notes = await userClient.query(Map(
        Paginate(
            Intersection(
                Match(
                    Index('notes_by_campaign'), campaign),
                Match(
                    Index('notes_by_user'),Select(['data','url'], Get(CurrentIdentity())))
            ), {size : 100000}
        ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
    ))
    const messages = await userClient.query(Map(
        Paginate(
            Intersection(
                Match(
                    Index('messages_by_campaign'), campaign),
                Match(
                    Index('messages_by_user'),Select(['data','url'], Get(CurrentIdentity())))
            ), {size : 100000}
        ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
    ))
    res.statusCode = 200;
    res.json({notes, messages})
}