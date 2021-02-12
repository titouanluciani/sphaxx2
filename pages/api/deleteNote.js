const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Delete, Intersection, Select, Get, Match, Index} = faunadb.query

export default async (req, res) => {
    console.log("delete note req : ", JSON.parse(req.body))
    const {cookie, campaign, name, connect} = JSON.parse(req.body)
    const bool_connect = connect === 'true' ? true : false
    console.log(bool_connect)
    const user_url = cookie
    console.log('user url in delete note : ', user_url)

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

    const userClient = new faunadb.Client({ secret : user_secret })
    if(bool_connect){
        const note = await userClient.query(
            Delete(
                Select(
                    ['ref'],
                    Get(
                        Intersection(
                            Match(
                                Index("notes_by_campaign"), campaign
                            ),
                            Match(
                                Index("notes_by_user"), user_url
                            ),
                            Match(
                                Index("notes_by_name"), name
                            )
                        )
                    )
                )
            )
        )
        
        console.log(note)

        res.statusCode = 200
        res.json(note)
    }else{
        const message = await userClient.query(
            Delete(
                Select(
                    ['ref'],
                    Get(
                        Intersection(
                            Match(
                                Index("messages_by_campaign"), campaign
                            ),
                            Match(
                                Index("messages_by_user"), user_url
                            ),
                            Match(
                                Index("messages_by_name"), name
                            )
                        )
                    )
                )
            )
        )
        
        console.log(message)

        res.statusCode = 200
        res.json(note)
    }
}