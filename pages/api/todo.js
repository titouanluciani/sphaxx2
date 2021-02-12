const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Select, Get, Match, Index, Count, Paginate, } = faunadb.query

export default async (req, res) => {

    console.log("todo : ", req.body)
    const user_url = JSON.parse(req.body)

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
    const userClient = new faunadb.Client({ secret: user_secret })

    const todo = await userClient.query(
        Count(
            Paginate(
                Match(
                    Index("waitingLine_by_user"), user_url)
                )
            )
    )
    console.log("todo count : ", todo)


    res.statusCode = 200
    res.json(todo)

}
