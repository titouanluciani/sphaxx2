//Delay function
const delay = (time) => {
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    })
}

const personalStats = async () => {
    await delay(2000)
    let relationsNumber = parseInt(document.querySelector('.t-16.t-bold.link-without-visited-state').innerText.split(' ')[0])
    console.log(relationsNumber)
    window.scroll(0, document.body.offsetHeight)
    await delay(2000)
    let viewedProfile = parseInt(document.querySelector('.pv-dashboard-section__metric-count.t-32.t-black.t-light.block').innerText.split(' ')[0])
    console.log(viewedProfile)
    let cont = document.querySelector('.pv-dashboard-section__card-action.pv-dashboard-section__metric.update-views.ember-view')
    let postViewedNumber = parseInt(cont.querySelector('span').innerText)
    console.log(postViewedNumber)
    chrome.storage.local.set({ "relationsNumber":relationsNumber, "viewedProfile":viewedProfile, "postViewedNumber":postViewedNumber })
    chrome.runtime.sendMessage({'message':'got the numbers'})
    window.close()
}
/*setTimeout(async () => {
    let relationsNumber = parseInt(document.querySelector('.t-16.t-bold.link-without-visited-state').innerText.split(' ')[0])    
    console.log(relationsNumber)
    window.scroll(0, document.body.offsetHeight)
    await delay(2000)
    let viewedProfile = parseInt(document.querySelector('.pv-dashboard-section__metric-count.t-32.t-black.t-light.block').innerText.split(' ')[0])
    console.log(viewedProfile)
    let cont = document.querySelector('.pv-dashboard-section__card-action.pv-dashboard-section__metric.update-views.ember-view')
    let postViewedNumber = parseInt(cont.querySelector('span').innerText)
    console.log(postViewedNumber)
    chrome.storage.local.set({ "relationsNumber":relationsNumber, "viewedProfile":viewedProfile, "postViewedNumber":postViewedNumber })
    chrome.runtime.sendMessage({'message':'got the numbers'})
}, 1000)*/
//await delay(5000)
//personalStats()
document.addEventListener("DOMContentLoaded", personalStats());
