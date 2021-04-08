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
    const { action, wgDone, hasAccepted, isConnected, hasResponded, hold, note, prospectdref, userref, wgref } = info.info
    console.log(action, wgDone, hasAccepted, isConnected, hasResponded, hold, note, prospectdref, userref, wgref )

    //Update user
    console.log(userref)
    const updatedUser = await client.query(
        Update(
                Var(userref)
            ,
            { data : { 'hold': hold } }
        )
    )
    console.log(updatedUser)
    //Update wg
    const updatedWg = await client.query(
        Update(
                wgref.ref
            ,
            { data : { done: wgDone } }
        )
    )
    console.log(updatedWg)
    //Update prospect
    const updatedProspect = await client.query(
        Update(
                prospectdref
            ,
            { data : { 'action':action, 'note':note, 'isConnected' :isConnected , 'hasAccepted':hasAccepted, 'hasResponded':hasResponded } }
        )
    )
    console.log(updatedProspect)

    res.statusCode = 200
    res.send(updatedUser, updatedWg, updatedProspect)

}