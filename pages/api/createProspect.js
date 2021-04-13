require('dotenv').config()
const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Exists, Create, Collection, Match, Index, Update, Get, Var, Paginate, Intersection, Map, Select } = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const { cookie, url, campaign, name } = JSON.parse(req.body)
    console.log(cookie, url, campaign, name)
    await client.query(Create(
        Collection('prospects'),
        {data : { 
            campaign: campaign, 
            userUrl : cookie, 
            url: url,
            name: name
            }
        }
    ))
    res.statusCode = 200
}