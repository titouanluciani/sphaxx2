// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
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
          const token = await auth(c)
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
                  name: "Default Campaign", 
                  description: "Message to be sent. Click 'Add note' to add a note. Click 'Save' to save your note. Check the prospects before clicking 'Launch' to start automate",
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
