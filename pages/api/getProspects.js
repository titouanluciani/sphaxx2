const axios = require('axios')
require('dotenv').config()
const formattedResponse = require('./utils/formattedResponse')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Get, Lambda, Var, Index, Match, Union,Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    const user_secret = process.env.USER_SECRET
    console.log("user secret getprospects : ", user_secret)
    const userClient = new faunadb.Client({ secret:user_secret })
    const prospects = await userClient.query(Map(
        Paginate(
            Intersection(
                Match(
                    Index('prospects_by_campaign'),Select(['data','url'], Get(CurrentIdentity()))),
                Match(
                    Index('prospects_by_campaign'), campaign)
            ), {size : 100000}

        ), Lambda(['ref'], Select(['data'], Get(Var('ref'))))
    ))
    console.log(prospects)
    res.statusCode = 200;
    res.json(prospects)
}