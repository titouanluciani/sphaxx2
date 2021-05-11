require('dotenv').config()
const formattedResponse = require('./utils/formattedResponse')
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const auth = require('./auth')
const client = new faunadb.Client({ secret:process.env.FAUNA_SECRET_KEY })
const { Map, Create, Collection,Exists, Update, Match, Index, Paginate, Intersection } = faunadb.query

export default async (req, res) => {
  console.log(req.body)
  const { userUrl, imgUrl, name } = JSON.parse(req.body)
  const c = userUrl
  let token = {}
  const userExist = await client.query(
          Exists(
                  Match(
                          Index('users_by_url'), c
                  )
          )
  )
  if(userExist){
          token = await auth(c)
          console.log('token : ',token)
  }else{
          await client.query(Create(Collection("users"), {
                  credentials: { password: c },
                  data: {
                    url: c,
                    name:name,
                    img:imgUrl
                  }
                }))
          token = await auth(c)
          console.log('token after user creation : ',token)

          //Create default campaign with default prospects
          await client.query(Create(
                  Collection('Campaigns'),
                  {data : { 
                      name: "Default Campaign", 
                      userUrl: c
                      } 
                  }
              )
          )
          await client.query(Create(
                  Collection('notes'),
                  { data : {
                        userUrl: c,
                        campaign: "Default Campaign",
                        name: "Default Note",
                        description: "Hi ! Happy to connect !"
                  } }
          ))
          await client.query(Create(
                  Collection('prospects'),
                  {data : { 
                      name: "Titouan Luciani", 
                      url: "https://www.linkedin.com/in/titouan-luciani-160943160/",
                      userUrl:c,
                      campaign:"Default Campaign"
                    } 
                  }
              )
          )
          await client.query(Create(
            Collection('notes'),
              {data : { 
                  name: "Default Note", 
                  description: "Type here the message to be sent. Click 'Add note' to add a note. Click 'Save' to save your note. Check the prospects before clicking 'Launch' to start sending connection requests",
                  userUrl:c,
                  campaign:"Default Campaign"
                } 
              }
            )
          )
          
          
  }

  console.log('token : ',token)
  const userClient = new faunadb.Client({ secret: token.secret })

  
  const exist = await userClient.query(
          Exists(
                  Match(
                          Index('tokens_by_url'), c
                  )
          )
  )
  
  console.log("Is there any token already for that user ???",exist)
  if(!exist){
          await client.query(
                  Create(
                          Collection('tokens'),
                          { data: { userUrl: c, token: token } }
                  )
          )
  }else{
          await client.query(
                  Update(
                          Collection('tokens'),
                          { data: { token: token } }
                  )
          )
          console.log("token updated")  

  }
}
