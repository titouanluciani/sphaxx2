import { React, useEffect, useState } from 'react';

export default function Dashboard({ cookie, cookiesSession }){
    const [campaign, setCampaign] = useState('Default Campaign')
    const [campaigns, setCampaigns] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [acceptanceRate, setAcceptanceRate] = useState(0)
    const [relationsNumber, setRelationsNumber] = useState(0)
    const [viewedProfile, setViewedProfile] = useState(0)
    const [postViewedNumber, setPostViewedNumber] = useState(0)
    
    useEffect(async () => {
        try{
          if(document.cookie.split(";").find(row=>row.startsWith('relationsNumber'))){
            setRelationsNumber(document.cookie.split(";").find(row=>row.startsWith('relationsNumber')).split('=')[1])
          }else if(document.cookie.split(";").find(row=>row.startsWith(' relationsNumber'))){
            setRelationsNumber(document.cookie.split(";").find(row=>row.startsWith(' relationsNumber')).split('=')[1])
          }
          if(document.cookie.split(";").find(row=>row.startsWith(' viewedProfile'))){
            setViewedProfile(document.cookie.split(";").find(row=>row.startsWith(' viewedProfile')).split('=')[1])
          }else if(document.cookie.split(";").find(row=>row.startsWith('viewedProfile'))){
            setViewedProfile(document.cookie.split(";").find(row=>row.startsWith('viewedProfile')).split('=')[1])
          }
          if(document.cookie.split(";").find(row=>row.startsWith(' postViewedNumber'))){
            setPostViewedNumber(document.cookie.split(";").find(row=>row.startsWith(' postViewedNumber')).split('=')[1])
          }else if(document.cookie.split(";").find(row=>row.startsWith('postViewedNumber'))){
            setPostViewedNumber(document.cookie.split(";").find(row=>row.startsWith('postViewedNumber')).split('=')[1])
          }
          //const cook = document.cookie.split(";").find(row=>row.startsWith(' userUrl')).split('=')[1]
          //setCookiesSession(document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')).split('=')[1] ? document.cookie.split(";").find(row=>row.startsWith(' cookiesSession')) : document.cookie.split(";").find(row=>row.startsWith('cookiesSession') ))
        }catch(err){
          console.error("cookie stats err : ",err)
        }
        
      }, [])

    const monitore = async () => {
        /*await fetch('/api/monitoring', {
            method:'POST',
            body:JSON.stringify({ cookie, cookiesSession})
          })*/
    }
    const loadCampaigns = async (cookie) => {
        const res = await fetch('/api/getCampaigns',{
            method:'POST',
            body: JSON.stringify(cookie)
        })
        const res_campaigns = await res.json();
        setCampaigns(res_campaigns.data)
        console.log("campaigns after loadcampaigns : ",campaigns)
    }
    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setCampaignHasChanged(prev => !prev)
    }
    const getRates = async () => {
        const res = await fetch('api/getRates', {
            method: 'POST',
            body: JSON.stringify({ campaign, cookie })
        })
        console.log("response from getRates  : ",res)
        let rates = await res.json()
        setAcceptanceRate(Math.trunc(rates*100))
        console.log("response from getRates 2  : ",rates)
    }
    useEffect(() => {
        console.log("cookie for useEffect loadcamp in dash : ", cookie)
        console.log("cookiesSession for useEffect loadcamp in dash : ", cookiesSession)
        loadCampaigns(cookie);
        //setFilterProspects(selectedProspects)
    }, [cookie, cookiesSession])
    useEffect(() => {
        getRates()
    }, [campaign])
    useEffect(() => {
        console.log("acetpppet rant ", acceptanceRate)
    }, [acceptanceRate])
    return(
        <div className="ml-48 grid grid-cols-3 grid-rows-4 h-screen gap-1 justify-items-center items-center">
            <div className="bg-red-300 row-span-2 h-3/4 w-3/4 rounded grid gap-0 justify-items-center content-around shadow-lg">
                <h1 className="p-2 mt-1 font-bold">LinkedIn Stats</h1>
                <div className="flex flex-row text-center my-2">
                        <img width='28' height='28' src="https://cdn1.iconfinder.com/data/icons/feather-2/24/link-512.png" alt="" title="Number of relations"/>
                        <p className="ml-4">{relationsNumber}</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='28' height='28' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt="" title="Number of connection requests in holding"/>
                        <p className="ml-4">N</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='28' height='28' src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-eye-512.png" alt="" title="Number of profile views"/>
                        <p className="ml-4">{viewedProfile}</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='28' height='28' src="https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-512.png" alt="" title="Number of last post views"/>
                        <p className="ml-4">{postViewedNumber}</p>
                </div>
            </div>
            <div className="bg-blue-300 row-span-2 col-span-2 p-2 h-3/4 w-3/4 rounded shadow-lg">
                <h1 className="text-center font-bold">Global Performance</h1>
                <div className="flex flex-row space-x-4">
                    <button className="inline-block ml-4 mt-2 bg-purple-500 p-1 rounded text-white h-10 px-2" onClick={getRates}>Refresh Stats</button>
                    <select className="rounded h-10 mt-2 px-1" onChange={handleCampaigns} name="" id="">
                    {campaigns.map(campaign => campaign == 'Default Campaign' ? 
                                (
                                    <option selected value={campaign.name}>{campaign.name}</option>
                                )
                            : (
                                <option value={campaign.name}>{campaign.name}</option>
                                )
                    )}
                    </select>
                </div>
                <div className="flex flex-row justify-around pt-4">
                    <div className="">
                        <h2>Acceptance rate :  </h2>
                        <h2 className="text-4xl pt-4">38 %</h2>
                    </div>
                    <div className="">
                        <h2>Response rate : </h2>
                        <h2 className="text-4xl pt-4"> 23 %</h2>

                    </div>
                </div>
            </div>
            <div className="bg-green-300 col-span-full row-span-2 h-3/4 w-3/4 rounded shadow-lg">
                <h1 className="p-2 text-center font-bold">Activity Report</h1>
            </div>
        </div>

    )
}