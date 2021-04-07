const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const { info } = JSON.parse(req.body)
    console.log(info)
    /*
    await client.query(
        Update(
            Get(
                Match(Index("user_by_url"), info.user.data.url)
            ),
            { data : {  } }
        )
    )*/
    res.send("zrezezr")

}