import next from 'next'
import ProspectList from '../../components/ProspectList'

const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const { info } = JSON.parse(req.body)
    console.log(info)
    const { nextAction, user, prospectd } = info
    console.log(nextAction, user, prospectd)

    //Update user
    const updatedUser = await client.query(
        Update(
            Get(
                Match(Index("user_by_url"), user.data.url)
            ),
            { data : { 'hold': user.data.hold } }
        )
    )
    console.log(updatedUser)
    //Update wg
    const updatedWg = await client.query(
        Update(
            Get(
                info.nextAction.ref
            ),
            { data : { done: nextAction.data.done } }
        )
    )
    console.log(updatedWg)
    //Update prospect
    const updatedProspect = await client.query(
        Update(
            Get(
                info.prospectd.ref
            ),
            { data : { 'action':prospectd.data.action, 'note':prospectd.data.note, 'isConnected' :prospectd.data.isConnected , 'hasAccepted':prospectd.data.hasAccepted, 'hasResponded':prospectd.data.hasResponded } }
        )
    )
    console.log(updatedProspect)

    res.statusCode = 200
    res.send(updatedUser, updatedWg, updatedProspect)

}