const axios = require('axios')
require('dotenv').config()
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_SECRET_KEY})
const {Paginate, Select, Create, Get, Lambda, Var, Index, Match, 
    Let,Documents, Collection, Map, Ref, CurrentIdentity, Logout} = faunadb.query

export default async (req, res) => {
    console.log(JSON.parse(req.body))
    const campaignName = JSON.parse(req.body).name
    const user_url = JSON.parse(req.body).cookie

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
    console.log("CREATE CAMP user secret createCamp : ", user_secret)
    const userClient = new faunadb.Client({ secret:user_secret })
    campaignName = campaignName.trim()
    const newCampaign = await client.query(Create(
        Collection('Campaigns'),
        { data : { name:  campaignName , userUrl : user_url } }
    ))

    console.log(newCampaign)
    res.statusCode = 200;
    res.json(newCampaign)
}