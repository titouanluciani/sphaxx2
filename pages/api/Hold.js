const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Update, Select, Get, Match, Index } = faunadb.query

export default async function Hold(req, res){
    console.log(req.body)
    const { cookie, hold } = JSON.parse(req.body)
    console.log(cookie, hold)
    await client.query(
        Update(Select( ['ref'] ,Get(
            Match(Index("users_by_url"),cookie))),
            {data:{hold:hold}})
    )
    res.statusCode = 200
    res.send(hold)

}