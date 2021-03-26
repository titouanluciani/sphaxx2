require('dotenv').config
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Map, Create, Collection, Select, Get, Var, CurrentIdentity, Lambda, Match, Index } = faunadb.query

export default async function(req, res){
    console.log(req.body)
    console.log(JSON.parse(req.body))
    const {campaign, selectedProspects, option, description, connect, cookie, action} = JSON.parse(req.body)
    console.log(campaign, selectedProspects, option, description, connect, action, cookie)
    console.log("Launch Connect")
    const bool_connect = connect === 'true' ? true : false

    const user_secret = await client.query(
        Select(
            ['data', 'token', 'secret'],
            Get(
                Match(
                    Index('tokens_by_url'),
                    cookie
                )
            )
        )
    )
    console.log("launchConnect :: this is user secret : ",user_secret)
    const userClient = new faunadb.Client({ secret: user_secret })
    
    //Get all prospectsUrl from wg
    const wgs = await userClient.query(
        Map(
            Paginate(
            Intersection(
                Match("waitingLine_by_done", false),
                Match("waitingLine_by_campaign", "anglish camp"),
                Match(
                "waitingLine_by_user",
                "https://www.linkedin.com/in/titouan-lenormand-059218202/"
                )   
            )
            ),
            Lambda("wg", Get(Var("wg")))
        )
    )
    //Update prospects action that already are in wg
    for(let wg of wgs.data){
        if(selectedProspects.includes(wg.data.prospectUrl) && wg.data.action == action){
            console.log("update wg")
            await userClient.query(
                Update(
                    wg.ref,
                    {data : { 
                        campaign: campaign, 
                        option: option, 
                        description: description, 
                        done:false,
                        } 
                    }
                )
            )
            const index = selectedProspects.indexOf(wg.data.prospectUrl);
            if (index > -1) {
                console.log("remove in selectedProspects")
                selectedProspects.splice(index, 1);
            }
        }
    }

    const ref = await userClient.query(
        Map(
            selectedProspects, 
            Lambda(
                'obj', 
                Create(
                    Collection('waitingLine'),
                    {data : { 
                        campaign: campaign, 
                        prospectUrl : Select('url',Var('obj')), 
                        prospectName : Select('name',Var('obj')), 
                        option: option, 
                        description: description, 
                        action: action,
                        done:false,
                        userUrl: Select(['data','url'], Get(CurrentIdentity())) 
                        } 
                    }
                )
            )
        )
    )
    console.log(ref)
    res.statusCode = 200
    res.json(ref)


}