import next from 'next'

const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query

export default async function getNextUrl(req, res){
    console.log(req.body)
    const { cookie } = JSON.parse(req.body)
    console.log(cookie)
    const nextAction = await client.query(
        Get(
            Select(['data',0],
                Paginate(
                    Intersection(
                        Match(Index("waitingLine_by_done"), false),
                        Match(
                            Index("waitingLine_by_user"),
                            cookie
                        )
                    )
                )
            )
        )
    )

    //Get the associated prospect for more information
    console.log(nextAction)
    res.statusCode = 200
    res.send(JSON.stringify(nextAction))
}