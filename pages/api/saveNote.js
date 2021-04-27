require('dotenv').config
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const {Paginate, Select, Get, Lambda, Var, Index, Match, Union, Update, Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log("Save note : ",req.body)
    console.log(JSON.parse(req.body))
    const { name, oldName ,description, campaign, connect, cookie } = JSON.parse(req.body)
    console.log(name, oldName ,description, campaign, connect, cookie)
    console.log(connect, typeof connect)
    const bool_connect = connect === 'true' ? true : false
    console.log(bool_connect)

    const user_url = cookie

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
    console.log("SAVENOTE :: this is user secret : ",user_secret)

    const userClient = new faunadb.Client({ secret: user_secret })
    if(bool_connect){
        console.log(bool_connect)
        const ref = await userClient.query(Update(
            Select(['data',0], Paginate(Intersection(
                    Match(Index('notes_by_name'), oldName),
                    Match(Index('notes_by_campaign'), campaign),
                    Match(Index('notes_by_user'), Select(['data','url'], Get(CurrentIdentity())))
                ), {size : 100000})
            ), {data : { name:name, description:description } }
        ))
        console.log('ref : ', ref)
        res.statusCode = 200
        res.json(ref)
    }else{
        console.log(bool_connect)
        const ref = await userClient.query(Update(
            Select(['data',0], Paginate(Intersection(
                    Match(Index('messages_by_name'), oldName),
                    Match(Index('messages_by_campaign'), campaign),
                    Match(Index('messages_by_user'), Select(['data','url'], Get(CurrentIdentity())))
                ), {size : 100000})
            ), {data : { name:name, description:description } }
        ))
        console.log('ref : ', ref)
        res.statusCode = 200
        res.json(ref)
    }
}