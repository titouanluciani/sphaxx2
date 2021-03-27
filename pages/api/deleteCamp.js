const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Create, Get, Lambda, Var, Index, Match, Delete, Ref,Intersection,
    Let,Documents, Collection, Map, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log(JSON.parse(req.body))
    const {campaignName, cookie} = JSON.parse(req.body)
    const user_url = cookie
    console.log(campaignName)
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
    console.log("DELETE CAMP user secret  : ", user_secret)
    const userClient = new faunadb.Client({ secret:user_secret })

    const deleteCampaign = await userClient.query(Delete(Select(['ref'],Get((Intersection(
        Match(Index('campaigns_by_name'), campaignName),
        Match(Index('campaigns_by_user'), Select(['data','url'], Get(CurrentIdentity()))),

    ))))))
    await userClient.query(
        Map(Paginate(
            Intersection(
                Match(Index('prospects_by_campaign'), "ceo londres tech&serv software"),
                Match(Index('prospects_by_user'), "https://www.linkedin.com/in/titouan-lenormand-059218202/"),
            )
          ), Lambda('ref', Delete(Var('ref')))
        )
    )

    console.log(deleteCampaign)
    res.statusCode = 200;
    res.json(deleteCampaign)
}