import React, { useEffect, useState } from 'react'
import ProspectList2 from '../components/ProspectList2'

export default function Prospects({cookie, cookiesSession, userInfo}){
    const [prospects, setProspects] = useState([]) 
    const [campaign, setCampaign] = useState('All')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [hold, setHold] = useState(false)
    const [changed, setChanged] = useState(true)

    const loadProspects = async (campaign, cookie) => {
        try{
            if(campaign == 'All'){
                const res = await fetch(`/api/waitingLines`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {waitingLine} = await res.json();
                console.log("wggg : ",waitingLine) 
                setProspects(waitingLine.data.filter(prospect => prospect.done == false))

            }else{
                const res = await fetch(`/api/waitingLines/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {waitingLine} = await res.json();
                console.log("wggg : ",waitingLine.data.filter(prospect => prospect.done == false)) 
                console.log("wGG  :", waitingLine.data)
                //setProspects(waitingLine.data.filter(prospect => prospect.done == false))
                setProspects(waitingLine.data)
            }

        }catch(err){
            console.error(err)
        }
    }
    const loadCampaigns = async (cookie) => {
        const res = await fetch('/api/getCampaigns',{
            method:'POST',
            body: JSON.stringify(cookie)
        })
        const res_campaigns = await res.json();
        setCampaigns(res_campaigns.data)
    }
    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setSelectedProspects([])
        setCampaignHasChanged(prev => !prev)
    }
    const handleCheck = (e) => {
        console.log("e target : ", e.target)
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat({'url':e.target.value, 'name':e.target.name, 'campaign':e.target.placeholder}))
        }else{
            setSelectedProspects(selectedProspects.filter(el => el.url !== e.target.value))
        }
    }
    const handleCheckAll = (e) => {
        if(e.target.checked){
            setSelectedProspects([])
            setSelectedProspects(selectedProspects.concat(prospects.map(prospect => new Object({'url':prospect.url, 'name':prospect.name, 'campaign':prospect.campaign}))))
            setIsCheckAll(true)
        }else{
            setSelectedProspects([])
            setIsCheckAll(false)
        }
        console.log("handlecheckAll : ", isCheckAll)
    }

    const handleDelete = async () => {
        console.log("delete : ",selectedProspects, campaign)
        await fetch('api/DeleteWG', {
            method: 'POST',
            body:JSON.stringify({cookie, selectedProspects})
        })
        setChanged(!changed)
        await loadProspects(campaign, cookie)
        setSelectedProspects([])
    }
    const handleWG = async () => {
        console.log("thiiiss is hold after : ",!hold)
        let hold2 = !hold
        await fetch('api/Hold',{
            method: 'POST',
            body: JSON.stringify({cookie, hold:hold2})
        })
        document.getElementById('hold').style.background = !hold ? '#00CC33' : '#FF0000'
        document.getElementById('hold').innerText = !hold ? 'Start' : 'Stop'
        setHold(hold => !hold)

    }
    useEffect(() => {
        console.log("cookie for useEffect loadprosp loadcamp : ", cookie)
        loadProspects(campaign, cookie);
        loadCampaigns(cookie);
        
    }, [cookie, cookiesSession])
    useEffect(() => {
        if(typeof userInfo !== 'undefined' && typeof userInfo.data !== 'undefined' && typeof userInfo.data.hold !== 'undefined'){
            console.log("this is user infop ", userInfo.data.hold)
            setHold(userInfo.data.hold)
            document.getElementById('hold').style.background = userInfo.data.hold ? '#00CC33' : '#FF0000'
        }
    }, [userInfo])
    useEffect(() => {
        loadProspects(campaign, cookie);
    }, [campaign])
    useEffect(() => {
        console.log(selectedProspects)
    }, [selectedProspects])
    return (
        <div className="flex flex-col h-screen ml-48 p-4">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="All">All</option>
                    </select>
            <button onClick={handleWG} id="hold" className="rounded p-2 bg-red-500 my-2 w-32 h-12 text-white">{ hold ? "Start" : "Stop" }</button>
            <ProspectList2 prospects={prospects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} handleCheckAll={handleCheckAll} isCheckAll={isCheckAll} handleDelete={handleDelete} campaign={campaign} two={true} changed={changed} />

        </div>
    )
}