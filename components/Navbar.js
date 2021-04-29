import NavBlock from './NavBlock'
//import home from 
import Image from 'next/image'
import React , { useState, useEffect } from 'react'




export default function Navbar({ cookie, userInfo }){
    const [prospects, setProspects] = useState(20) 
    const [campaignsNumber, setCampaignsNumber] = useState(3)
    const [wg, setWg] = useState(10)
    let data = [{
        name:"Dashboard",
        icon:'https://cdn0.iconfinder.com/data/icons/very-basic-android-l-lollipop-icon-pack/24/home-512.png',
        number:null,
        page:"/dashboard"
    },{
        name:"Campaigns",
        icon:"https://cdn2.iconfinder.com/data/icons/seo-flat-6/128/25_Campaign_Launch-512.png",
        number:campaignsNumber,
        page:"/campaign"
    },{
        name:"Waiting Line",
        icon:"https://cdn2.iconfinder.com/data/icons/font-awesome/1792/hourglass-o-512.png",
        number:wg,
        page:"/waitingLine"
    }]
/*{
    name:"Prospects",
    icon:"https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-512.png",
    number:prospects,
    page:"/prospects"
}*/
    const loadCampaigns = async (cookie) => {
        console.log(" navbar campNum : ", cookie)

        const res = await fetch('api/getCampaigns', {
            method: 'POST',
            body: JSON.stringify(cookie)
        })
        const prospects_res = await fetch(`/api/campaigns/`,{
            method:'POST',
            body:JSON.stringify(cookie)
        });
        const wg_res = await fetch(`/api/waitingLines`,{
            method:'POST',
            body:JSON.stringify(cookie)
        });
        const {waitingLine:wg} = await wg_res.json();
        const {prospects} = await prospects_res.json();
        const campaigns = await res.json()
        console.log("navbar campaigns : ", campaigns.data.length,prospects.data.length, wg.data.length )
        setProspects(prospects.data.length)
        setCampaignsNumber(campaigns.data.length)
        setWg(wg.data.length)
        return campaigns.data
    }
    useEffect(async () => {
        await loadCampaigns(cookie)
        
        console.log("campaigns number : ", campaignsNumber,data[1].number)
    }, [cookie])

    return(
        <div className="h-screen fixed bg-red-100 flex flex-col justify-between space-y-8 w-48">
            <div className="overflow-y-auto divide-y-2 divide-opacity-10 divide-black">
                <h1 className="my-4 text-2xl text-center">Sphaxx</h1>
                <div className="flex flex-col items-center py-6">
                    <img src={userInfo.data ? userInfo.data.img : ''} width="64" height="64" alt="pp" className=""/>

                    <h2 className="mt-3 mb-0">{userInfo.data ? userInfo.data.name : ''}</h2>
                </div>
                <div className="flex flex-col items-stretch py-6">
                        <NavBlock data={data} campaignsNumber={campaignsNumber} />
                </div>
                <div className="block">
                    <a className="bg-indigo-400 p-1 rounded text-white" href="https://sphaxx.co/tutorials" target="_blank">Need Help ?</a><br/>
                    <a className="bg-indigo-400 p-1 rounded text-white" href="https://sphaxx.co/tutorials" target="_blank">See our Tutorial</a>
                </div>
            </div>
            
        </div>
    )
}