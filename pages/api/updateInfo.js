import next from 'next'
import ProspectList from '../../components/ProspectList'

const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const { info, user, nextAction, prospectd } = JSON.parse(req.body)
    console.log(info, user, nextAction, prospectd)
    const { action, wgDone, hasAccepted, isConnected, hasResponded, hold, note } = info
    console.log(action, wgDone, hasAccepted, isConnected, hasResponded, hold, note )

    //Update user
    const updatedUser = await client.query(
        Update(
            Get(
                Match(Index("user_by_url"), user.data.url)
            ),
            { data : { 'hold': hold } }
        )
    )
    console.log(updatedUser)
    //Update wg
    const updatedWg = await client.query(
        Update(
            Get(
                nextAction.ref
            ),
            { data : { done: wgDone } }
        )
    )
    console.log(updatedWg)
    //Update prospect
    const updatedProspect = await client.query(
        Update(
            Get(
                prospectd.ref
            ),
            { data : { 'action':action, 'note':note, 'isConnected' :isConnected , 'hasAccepted':hasAccepted, 'hasResponded':hasResponded } }
        )
    )
    console.log(updatedProspect)

    res.statusCode = 200
    res.send(updatedUser, updatedWg, updatedProspect)

}