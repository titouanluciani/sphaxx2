require('dotenv').config
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const {Paginate, Select, Get, Lambda, Var, Index, Match, Union, Update, Intersection,
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    console.log(JSON.parse(req.body))
    const { name, oldName ,description, campaign, connect } = JSON.parse(req.body)
    console.log(connect)
    const bool_connect = connect === 'true' ? true : false
    const userClient = new faunadb.Client({ secret: process.env.USER_SECRET })
    if(bool_connect){
        console.log(bool_connect)
        const ref = await userClient.query(Update(
            Select(['data',0], Paginate(Intersection(
                    Match(Index('notes_by_name'), oldName),
                    Match(Index('notes_by_campaign'), campaign),
                    Match(Index('notes_by_user'), Select(['data','url'], Get(CurrentIdentity())))
                ))
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
                ))
            ), {data : { name:name, description:description } }
        ))
        console.log('ref : ', ref)
        res.statusCode = 200
        res.json(ref)
    }
}