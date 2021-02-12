const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Create, Collection, Select, Get, Match, Index} = faunadb.query

export default async (req, res) => {
    console.log("new note req : ", JSON.parse(req.body))
    const {cookie, campaign, connect} = JSON.parse(req.body)
    const bool_connect = connect === 'true' ? true : false
    console.log(bool_connect)
    const user_url = cookie
    console.log('user url in new note : ', user_url)

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
            Create(
                Collection('notes'),
                { data: { userUrl: user_url, campaign: campaign, name: "New note", description:"" } }
            )
        )
        
        console.log(note)
    
        res.statusCode = 200
        res.json(note)
    }else{
        const message = await userClient.query(
            Create(
                Collection('messages'),
                { data: { userUrl: user_url, campaign: campaign, name: "New message", description:"" } }
            )
        )
        
        console.log(message)
    
        res.statusCode = 200
        res.json(message)
    }
}