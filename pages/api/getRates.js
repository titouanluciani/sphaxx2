require('dotenv').config()
const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })
const { Exists, Create, Lambda, Match, Index, Update, Get, Var, Paginate, Intersection, Map, Select } = faunadb.query

export default async (req, res) => {
    console.log(req.body)
    const { campaign, cookie } = JSON.parse(req.body)
    //Acceptance rate : prospects where wg action done campaign hasAccepted = true / wg done campaign
    if(campaign == 'Default Campaign'){
        console.log("aallll")
        const wg = await client.query(
            Map(
                Paginate(
                  Intersection(
                    Match(Index("waitingLine_by_done"), true),
                    Match(Index("waitingLine_by_user"), cookie),
                    )
                  ), Lambda('x', Get(Var('x')))
                )
        )
        const prospects = await client.query(
            Map(Select(['data'],
                Paginate(
                  Intersection(
                    Match(Index("prospects_by_user"), cookie),
                    )
                  )), Lambda('x', Get(Var('x')))
                )
        )
        //WgUrl : all wg linkedin url /// prospectsInWg : all prospects that had action done in wg
        let wgUrl = []
        let prospectsInWg = []
        let prospectsInWgHasAccepted = []
        //console.log(wg.data.map(el => console.log(el.data.prospectUrl)))
        wg.data.map(el => wgUrl.push(el.data.prospectUrl))
        //console.log(prospects)
        for(let prospect of prospects){
            if(wgUrl.includes(prospect.data.url) && prospect.data.hasAccepted){
                prospectsInWgHasAccepted.push(prospect)
            }else if(wgUrl.includes(prospect.data.url)){
                prospectsInWg.push(prospect)
            }
        }
        // acceptance rate : prospectsInWG with has accepted = true / prospectsInWg
        //console.log(prospectsInWgHasAccepted,prospectsInWg )
        console.log(prospectsInWgHasAccepted.length,prospectsInWg.length )

        const acceptanceRate = prospectsInWgHasAccepted.length / prospectsInWg.length
        console.log(acceptanceRate)
        res.statusCode = 200
        res.send(acceptanceRate)
    }else{
        console.log("not all")
        const wg = await client.query(
            Map(
                Paginate(
                  Intersection(
                    Match(Index("waitingLine_by_done"), true),
                    Match(Index("waitingLine_by_campaign"), campaign),
                    Match(Index("waitingLine_by_user"), cookie),
                    )
                  ), Lambda('x', Get(Var('x')))
                )
        )
        const prospects = await client.query(
            Map(Select(['data'],
                Paginate(
                  Intersection(
                    Match(Index("prospects_by_campaign"), campaign),
                    Match(Index("prospects_by_user"), cookie)
                    )
                  )), Lambda('x', Get(Var('x')))
                )
        )
        //WgUrl : all wg linkedin url /// prospectsInWg : all prospects that had action done in wg
        let wgUrl = []
        let prospectsInWg = []
        let prospectsInWgHasAccepted = []
        //console.log(wg.data.map(el => console.log(el.data.prospectUrl)))
        wg.data.map(el => wgUrl.push(el.data.prospectUrl))
        //console.log(prospects)
        for(let prospect of prospects){
            if(wgUrl.includes(prospect.data.url) && prospect.data.hasAccepted){
                prospectsInWgHasAccepted.push(prospect)
            }else if(wgUrl.includes(prospect.data.url)){
                prospectsInWg.push(prospect)
            }
        }
        // acceptance rate : prospectsInWG with has accepted = true / prospectsInWg
        //console.log(prospectsInWgHasAccepted,prospectsInWg )
        console.log(prospectsInWgHasAccepted.length,prospectsInWg.length )

        const acceptanceRate = prospectsInWgHasAccepted.length / prospectsInWg.length
        console.log(acceptanceRate)
        res.statusCode = 200
        res.send(acceptanceRate)
    }
    


    //Response rate : prospects where wg action done campaign hasResponded = true / wg done campaign message has been sent (note ?)
}