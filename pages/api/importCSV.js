require('dotenv').config
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Collection, Create, If, ContainsField } = faunadb.query

export default async (req, res) => {
    console.log("import csv req body : ",req.body)
    const { data, cookie:user_url, campaign } = JSON.parse(req.body)
    console.log("import csv info : ",data.data, typeof data.data)
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
    /*[
        {
          url: 'https://www.linkedin.com/in/c%C3%A9lia-larochelle-31b095195/',
          name: 'Celia Larochelle'
        },
        {
          url: 'https://www.linkedin.com/in/alice-dalaric-9736471b2/',
          name: 'Alice Dalaric'
        },
        {
          url: 'https://www.linkedin.com/in/christoph-fleischmann-721482110/',
          name: 'Christophe Fletcher'
        },
        {
          url: 'https://www.linkedin.com/in/mouloud-bessa-660b03156/',
          name: 'Mouloud LaVeinasse'
        },
        { url: '' }
      ]*/
    const userClient = new faunadb.Client({ secret: user_secret })
    const create = await userClient.query(
        Map(
            data.data,
            Lambda(
                'prospect',
                Create(
                    Collection("prospects"),
                    {
                        data:{
                            name:If(ContainsField('name', 'prospect'),Select(['name'],Var('prospect')), ''),
                            url:Select(['url'],Var('prospect')),
                            userUrl:user_url,
                            campaign:campaign,
                            isConnected:false
                        }
                    }
                )
            )
        )
    )
    console.log(create)
    res.statusCode = 200
    res.send()
}