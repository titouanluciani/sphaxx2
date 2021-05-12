require('dotenv').config
const delay = require('./utils/delay')
const puppeteer = require('puppeteer')
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY })

const { Select, Map, Paginate, Match, Index, Lambda, Get, Var, Delete, Update, Intersection } = faunadb.query
import chromium from 'chrome-aws-lambda';
import { query } from 'faunadb';

export default async (req, res) => {
    console.log(req)
    const { url, cookies, userAgent } = JSON.parse(req)
    const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
        })
    console.log("launchhhh")
    
    const page = await browser.newPage()
    console.log("pageeee : ", userAgent)
    await page.setUserAgent(userAgent);

    
    await delay(Math.random() + 3000)
    await page.goto("https://linkedin.com")
    console.log("linkedin")

    await page.setCookie(...[cookies])
    await page.goto(url)

    await delay(Math.random() * 1.5 + 2000)

    let relationsNumber = await page.evaluate(() => {
        return parseInt(document.querySelector('.t-16.t-bold.link-without-visited-state').innerText.split(' ')[0])
    })
    console.log(relationsNumber)
    const x = await page.viewport().width
    const y = await page.viewport().height
    await page.mouse.wheel({deltaX : x ,deltaY : y*9 })
    //window.scroll(0, document.body.offsetHeight)
    await delay(2000)
    let viewedProfile = await page.evaluate(() => {
        return parseInt(document.querySelector('.pv-dashboard-section__metric-count.t-32.t-black.t-light.block').innerText.split(' ')[0])
    })
    console.log(viewedProfile)
    let cont = await page.evaluate(() => {
        return document.querySelector('.pv-dashboard-section__card-action.pv-dashboard-section__metric.update-views.ember-view')
    })
    let postViewedNumber = await page.evaluate((cont) => {
        return parseInt(cont.querySelector('span').innerText)
    })
    console.log(postViewedNumber)
    /*chrome.storage.local.set({ "relationsNumber":relationsNumber, "viewedProfile":viewedProfile, "postViewedNumber":postViewedNumber })
    chrome.runtime.sendMessage({'message':'got the numbers'})
    window.close()*/
    res.statusCode = 200
    res.send(JSON.stringify({ "relationsNumber":relationsNumber, "viewedProfile":viewedProfile, "postViewedNumber":postViewedNumber }))
}