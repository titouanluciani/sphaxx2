const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Delete, Intersection, Select, Get, Match, Index, Lambda, Paginate, Let, Var, Map} = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const {cookie, selectedProspects, campaign} = JSON.parse(req.body)
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
    
    const deleted = await client.query(
            Map(
                selectedProspects,
                Lambda(
                    'selectedProspect',
                    Delete(Select( ['data',0] ,Paginate(
                        Select(
                            ['ref'],
                            Get(
                                Intersection(
                                    Match(
                                        Index("prospects_by_campaign"), Select(['campaign'], Var('selectedProspect'))
                                    ),
                                    Match(
                                        Index("prospects_by_url"), Select(['url'], Var('selectedProspect'))
                                    ),
                                    Match(
                                        Index("prospects_by_user"), cookie
                                    )   
                                )
                            )
                        )
                    )))
                )
            )
    )
    console.log(deleted)
    res.statusCode = 200
    res.send(deleted)

}