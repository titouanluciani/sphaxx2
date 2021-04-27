
require('dotenv').config()
const puppeteer = require('puppeteer')
const formattedResponse = require('./utils/formattedResponse')
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret:process.env.FAUNA_SECRET_KEY })
const { Map, Create, Collection, Select, Get, Var, CurrentIdentity, Lambda, Match, Index, Paginate, Intersection } = faunadb.query
import chromium from 'chrome-aws-lambda';


export default async(event, context) => {
  

    try {
        let j = 0
        let h = 0
        let name2 = ""
        let profile_href = ""
        console.log(event.body)
        const {url:url2, cookie, cookies, number, campaign, i} = JSON.parse(event.body)
        console.log(cookies)
        let data2 = []
        console.log("start",campaign)
        const browser = await puppeteer.launch({
          args: [...chromium.args,  "--disable-web-security"],//"--hide-scrollbars",
        defaultViewport: null,//chromium.defaultViewport
        executablePath: await chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
        })
        console.log("launch", number)

        const page = await browser.newPage()
        console.log("page")
        setTimeout(async () => {
          console.log("60 sec has past : ", page.url())
          await browser.close()
          //context.setHeader('Access-Control-Allow-Origin','http://localhost:3000/api/scrapeProfiles')
          context.statusCode = 200
          context.send(page.url())
        }, 52*1000);
        //await delay(3000)
        await page.setViewport({ width: 1280, height: 800 })
        //await delay(3000)
        await page.goto("https://linkedin.com")
        console.log("linkedin")
        console.log(cookies)
        await page.setCookie(...[cookies])
        //console.log("cookies")
        /*
        //await delay(3000)
        await page.goto("https://linkedin.com/feed/")

        // Get current user 's linkedin's url (PRIMARY KEY)
        await page.waitForSelector('.feed-identity-module__actor-meta.profile-rail-card__actor-meta.break-words')
        const a = await page.$('.feed-identity-module__actor-meta.profile-rail-card__actor-meta.break-words')
        const pr = await a.$('a')*/
        console.log(cookie)
        let c = cookie.value
        /*
        try{
          const b = await pr.getProperty('href')
          c = await b.jsonValue()
          console.log(c)
        }catch(err){
          console.log("errr",err)
        }
        */
        //await delay(3000)
        console.log("url2 : ", url2)
        let url3 = ""
        if(url2.includes("&page=")){
          url3 = url2.replace(`&page=${parseInt(url2.slice(-1))}`, "") + `&page=${parseInt(url2.slice(-1)) + i}`
        }else{
          url3 = url2 + `&page=${i}`
        }
        console.log("url2 : ", url3)
        await page.goto(url3)
        console.log("url")
        await delay(3000)
        const x = await page.viewport().width
        const y = await page.viewport().height

        //Make the number of pages appear in DOM
        //await delay(3000)
        console.log("mooooove : ", x, y)
        await page.mouse.wheel({deltaX : x ,deltaY : y*9 })
        await delay(3000)

        await page.waitForSelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')

        //Get the number of pages
        const number_li = await page.$('.artdeco-pagination__indicator.artdeco-pagination__indicator--number.ember-view:last-child')
        const number_btn = await number_li.$('button')
        const number_span = await number_btn.$('span')
        const number_textContent = await number_span.getProperty('innerText')
        const number_json = await number_textContent.jsonValue()
        console.log(number_json, number)

        while(data2.length<number){
          await delay(3000)
          await page.mouse.wheel({deltaX : x ,deltaY : y*3 })

          
          // Get the number of linkedin profile in the current page
          const linkedin_profiles = await page.$$(".reusable-search__result-container ")
          console.log("lentgth : ", typeof parseInt(linkedin_profiles.length))
          console.log(cookie, c)
          //Prospects of the campaign
          const prospects = await client.query(
            Select(['data'],Map(
              Paginate(
                Intersection(
                  Match(
                    "prospects_by_user",
                    c
                  )
                  //Match("prospects_by_campaign", campaign)
                )
              ), Lambda('prospect', Get(Var('prospect')))
            ))
          )
          const prospectsUrl = []
          for(let prospect of prospects){
            prospectsUrl.push(prospect.data.url)
          }
          //console.log("prospects url : ", prospectsUrl)

          //"ul" tag with list of prospects on a page
          let ul = await page.$('.reusable-search__entity-results-list.list-style-none')
          console.log("li after ul")
          let li = await ul.$$('li') 
          console.log("li done")
          //Get 1,2,3rd relation distance
          let titles = await page.$$('.entity-result__title-text.t-16')
          console.log("titles done")
          for(let i=0;i< linkedin_profiles.length;i++){
              //console.log("iiiii : ", i)
              if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)){
                console.log("first")
                let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                name2 = await profile_name.getProperty('innerText')
                name2 = await name2.jsonValue()
              }else if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)){
                console.log("second")
                let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                profile_href = await profile_name.getProperty('href')
                profile_href = await profile_href.jsonValue()

                name2 = await profile_name.getProperty('innerText')
                name2 = await name2.jsonValue()
              }
              if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)){
                console.log("third")
                let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                name2 = await profile_name.getProperty('innerText')
                name2 = await name2.jsonValue()
              }else if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)){
                console.log("fourth")
                let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                name2 = await profile_name.getProperty('innerText')
                name2 = await name2.jsonValue()
              }

              if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)){
                console.log("fifth")
                let profile_url = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                profile_href = await profile_url.getProperty('href')
                profile_href = await profile_href.jsonValue()
              }else if(await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)){
                console.log("sixth")
                let profile_url = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                profile_href = await profile_url.getProperty('href')
                profile_href = await profile_href.jsonValue()
              }
              /*try{
                try{
                  let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                  name2 = await profile_name.getProperty('innerText')
                  name2 = await name2.jsonValue()
                  console.log(name2)
                  
                  let profile_url = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                  profile_href = await profile_url.getProperty('href')
                  profile_href = await profile_href.jsonValue()
                } catch(e) {
                  console.log("error on get property I guess : ",e)
                  
                  let profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                  profile_href = await profile_name.getProperty('href')
                  profile_href = await profile_href.jsonValue()

                  try{
                    name2 = await profile_name.getProperty('innerText')
                  }catch(e){
                    console.log("error on name 2 get property")
                    profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                    name2 = await profile_name.getProperty('innerText')
                    console.log("name2 rectrified")
                  }
                  name2 = await name2.jsonValue()
                  console.log(name2)
                  
                }
              }catch(e){
                console.log("this is an error : ", e)
                console.log("this is profile href : ", profile_href)
                console.log("this is name2: ", name2)
                if(profile_href == undefined){
                  console.log("error on href getproperty")
                  let profile_href = await page.$(`document.querySelector('#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a')`)
                  profile_href = await profile_href.getProperty('href')
                  profile_href = await profile_href.jsonValue()
                  console.log("href rectified : ", profile_href)
                }
                if(name2 == undefined){
                  console.log("error on name2 get property")
                  profile_name = await page.$(`#main > div > div > div.pv2.artdeco-card.ph0.mb2 > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a > span > span:nth-child(1)`)
                  name2 = await profile_name.getProperty('innerText')
                  name2 = await name2.jsonValue()
                  console.log(name2)
                }
                //name2 = ""
                //profile_href = ""
              }*/
              name2 = name2.split('Voir le profil de')[0]
              name2 = name2.trim()

              data2 = [...data2, {"name":name2,"url":profile_href, "userUrl":c,"campaign":campaign}]

              //Check button state
              /*let state = await page.evaluate(() => {
                return li[i].querySelector('.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view').innerText
              })*/
              let state = ''
              try{
                state = await li[i].$('.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view')
                console.log("staate")
                state = await state.getProperty('innerText')
                state = await state.jsonValue()
                console.log("staate2  :", state)
              }catch(err){
                console.log("err for state btn")
                state = ''
              }
              //Get relation distance
              let relation = ''
              try{
                relation = await titles[i].$('.image-text-lockup__text.entity-result__badge-text')
                console.log("relation  :")
                relation = await relation.getProperty('innerText')
                relation = await relation.jsonValue()
                console.log("relation2  :", relation)
              }catch(err){
                console.log("err for relation btn")
                relation = ''
              }
              //state == (Se connecter' || 'Connect') |||| ('En attente' || 'Pending') || Message
              if(profile_href == ""){
                h+=1;
                console.log("profile url empty : ", h)
              }
              console.log("prospectsUrl includeds url ? ",prospectsUrl.includes(profile_href))
              if(!prospectsUrl.includes(profile_href) && (profile_href !== "LinkedIn Member" && profile_href !== 'Membre de LinkedIn' && profile_href !== '' )){
                if(state == 'Se connecter' || state ==  'Connect'){
                  j+=1;
                  console.log("connnecctt")
                  await client.query(
                    q.Create(
                      q.Collection('prospects'),
                      {data : {name:name2,url:profile_href, userUrl:c, campaign:campaign, isConnected:false}}
                    )
                  )
                }
                else if(state == 'En attente' || state ==  'Pending'){
                  j+=1;
                  console.log("pendingggg")
                  await client.query(
                    q.Create(
                      q.Collection('prospects'),
                      {data : {name:name2,url:profile_href, userUrl:c, campaign:campaign, isConnected:true, hasAccepted: false }}
                    )
                  )
                }else if(state == 'Message' && (relation == '• 3rd+' || relation == '• 3e et +' ) ){
                  j+=1;
                  console.log("3rd trois petits points")
                  await client.query(
                    q.Create(
                      q.Collection('prospects'),
                      {data : {name:name2,url:profile_href, userUrl:c, campaign:campaign, isConnected:false, troisPetitsPoints:true }}
                    )
                  )
                }else{
                  j+=1;
                  console.log("alreaaddyy connecteddd")
                  await client.query(
                    q.Create(
                      q.Collection('prospects'),
                      {data : {name:name2,url:profile_href, userUrl:c, campaign:campaign, isConnected:true, hasAccepted: true }}
                    )
                  )
                }
              }
          }
          //console.log(data2)
          console.log(data2.length)
          console.log("Next page : ", j)
          

          await page.waitForSelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')
          //const suivant = await page.$('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')
          await page.click('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')

        }
        console.log(data2)
        console.log("done",data2.length)
        console.log("j ",j)
        //context.setHeader('Access-Control-Allow-Origin','chrome-extension://eiglnhpkhijlbopnpcdddiaagdgelamd')
        context.statusCode = 200
        context.send(data2)
        
        //return formattedResponse(200, data2)
        await browser.close()

    } catch(err) {
        console.error("errooorrr : ", err)
        await browser.close()
        return formattedResponse(500, data2)
    }
}