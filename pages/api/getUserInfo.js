const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Get, Match, Index, Select, Paginate, CurrentIdentity } = faunadb.query


export default async function(req, res){
    console.log(req.body)
    const {cookie} = JSON.parse(req.body)
    const user_url = cookie
    console.log(user_url)
    /*const user_secret = await client.query(
        Select(
            ['data', 'token', 'secret'],
            Get(
                Match(
                    Index('tokens_by_url'),
                    user_url
                )
            )
        )
    )*/
    const info = await client.query(
        Get(
            Select(
                ['data',0],
                Paginate(
                    Match(
                        Index("users_by_url"), user_url
                    ), {size : 100000}
                )
            )
        )
    )
    res.statusCode = 200
    res.send(info)
}