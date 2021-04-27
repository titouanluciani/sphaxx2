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
                    ), {size : 100000}
                )
            )
        )
    )
    console.log(nextAction)
    //Get the associated prospect for more information
    const prospectd = await client.query(
        Select(['data',0],
            Map(
                Paginate(
                    Intersection(
                        Match(Index('prospects_by_url'), nextAction.data.prospectUrl),
                        Match(Index('prospects_by_user'), cookie)
                    ), {size : 100000}
                ),
                Lambda('x', Get(Var('x'))
                )
            )
        )
    )
    //Get the user info, especially for "hold"
    const user = await client.query(
        Get(
            Match(
                Index('users_by_url'),
                cookie
            )
        )
    )
    res.statusCode = 200
    res.send(JSON.stringify({nextAction, user, prospectd}))
}