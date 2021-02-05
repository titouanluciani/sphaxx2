
require('dotenv').config()
const puppeteer = require('puppeteer')
const formattedResponse = require('./utils/formattedResponse')
const delay = require('./utils/delay')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret:process.env.FAUNA_SECRET_KEY })

export default async(event, context) => {
    try {
        let name2 = ""
        let profile_href = ""
        console.log(event.body)
        const {url:url2, cookies, number, campaign} = event.body
        console.log()
        console.log(cookies)
        let data2 = []
        console.log("start",campaign)
        const browser = await puppeteer.launch({headless:false})
        console.log("launch", number)

        const page = await browser.newPage()
        console.log("page")

        await delay(3000)
        await page.goto("https://linkedin.com")
        console.log("linkedin")
        await page.setCookie(...cookies)
        //console.log("cookies")

        await delay(3000)
        await page.goto("https://linkedin.com/feed/")

        // Get current user 's linkedin's url (PRIMARY KEY)
        await page.waitForSelector('.left-rail')
        const a = await page.$('.left-rail')
        const pr = await a.$('a')
        const b = await pr.getProperty('href')
        const c = await b.jsonValue()
        console.log(c)

        await delay(3000)
        await page.goto(url2)
        console.log("url")
        
        const x = await page.viewport().width
        const y = await page.viewport().height

        //Make the number of pages appear in DOM
        await delay(3000)
        await page.mouse.wheel({deltaX : x ,deltaY : y*3 })

        await page.waitForSelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')

        //Get the number of pages
        const number_li = await page.$('.artdeco-pagination__indicator.artdeco-pagination__indicator--number.ember-view:last-child')
        const number_btn = await number_li.$('button')
        const number_span = await number_btn.$('span')
        const number_textContent = await number_span.getProperty('textContent')
        const number_json = await number_textContent.jsonValue()
        console.log(number_json, number)

        while(data2.length<number){
          await delay(3000)
          await page.mouse.wheel({deltaX : x ,deltaY : y*3 })

          
          // Get the number of linkedin profile in the current page
          const linkedin_profiles = await page.$$(".reusable-search__result-container ")
          console.log("lentgth : ", typeof parseInt(linkedin_profiles.length))

          for(let i=0;i< linkedin_profiles.length;i++){
              //console.log("iiiii : ", i)
              try{
                let profile_name = await page.$(`body > div.application-outlet > div.authentication-outlet > div > div.neptune-grid.two-column.search-marvel-srp > div > div > div > div:nth-child(2) > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                name2 = await profile_name.getProperty('textContent')
                name2 = await name2.jsonValue()
                console.log(name2)
                
                let profile_url = await page.$(`body > div.application-outlet > div.authentication-outlet > div > div.neptune-grid.two-column.search-marvel-srp > div > div > div > div:nth-child(2) > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div.mb1 > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                profile_href = await profile_url.getProperty('href')
                profile_href = await profile_href.jsonValue()
              } catch(e) {
                console.log(e)
                let profile_name = await page.$(`body > div.application-outlet > div.authentication-outlet > div > div.neptune-grid.two-column.search-marvel-srp > div > div > div > div:nth-child(2) > ul > li:nth-child(${i+1}) > div > div > div.entity-result__content.entity-result__divider.pt3.pb3.t-12.t-black--light > div > div > div.t-roman.t-sans > span > div > span.entity-result__title-line.flex-shrink-1.entity-result__title-text--black > span > a`)
                name2 = await profile_name.getProperty('textContent')
                name2 = await name2.jsonValue()
                console.log(name2)
                
                profile_href = await profile_name.getProperty('href')
                profile_href = await profile_href.jsonValue()
              }
              
              data2 = [...data2, {"name":name2,"url":profile_href, "userUrl":c,"campaign":campaign}]
              client.query(
                q.Create(
                  q.Collection('prospects'),
                  {data : {name:name2,url:profile_href, userUrl:c, campaign:campaign}}
                )
              ).then(res=>console.log(res))
              .catch(err=>console.log(err))
          }
          console.log(data2)
          console.log(data2.length)
          console.log("Next page")
          
          //browser.close()

          await page.waitForSelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')
          //const suivant = await page.$('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')
          await page.click('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')

        }
        console.log(data2)
        console.log("done",data2.length)
        return formattedResponse(200, data2)
    } catch(err) {
        console.error("errooorrr : ", err)
        return formattedResponse(500, data2)
    }
}