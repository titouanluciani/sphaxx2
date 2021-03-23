const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Delete, Intersection, Select, Get, Match, Index} = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const {cookie, selectedProspects} = JSON.parse(req.body)
    console.log(cookie, selectedProspects)

    const user_secret = await client.query(
        Select(
            ['data', 'token', 'secret'],
            Get(
                Match(
                    Index('tokens_by_url'),
                    cookie
                )
            )
        )
    )
    const userClient = new faunadb.Client({ secret : user_secret })
    
    await userClient.query(
        Delete(
            Map(
                [selectedProspects],
                Lambda(
                    'selectedProspects',
                    Paginate(
                        Select(
                            ['ref'],
                            Get(
                                Intersection(
                                    Match(
                                        Index("waitingLine_by_url"), campaign
                                    ),
                                    Match(
                                        Index("waitingLine_by_user"), user_url
                                    ),
                                    Match(
                                        Index("notes_by_name"), name
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )

}