import React, { useEffect, useState } from 'react'
import ProspectList from  '../components/ProspectList'
import TabPanel from '../components/TabPanel'
import Modal from '../components/createCampModal'


export default function Campaign({cookie, cookiesSession}){
    const [prospects, setProspects] = useState([]) 
    const [notes, setNotes] = useState([]) 
    const [messages, setMessages] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [campaign, setCampaign] = useState('')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([{}])
    const [showModal, setShowModal] = useState(false)
    const [changed, setChanged] = useState(false)
    const [isCheckAll, setIsCheckAll] = useState(false)

    console.log("cookie in campaign pages : ", cookie)

    const loadProspects = async (campaign, cookie) => {
        try{
            if(campaign == 'All'){
                const res = await fetch(`/api/campaigns`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
                setProspects(prospects.data)
            }else{
                const res = await fetch(`/api/campaigns/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
                setProspects(prospects.data)
                setNotes(notes.data)
                setMessages(messages.data)
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
        console.log("campaigns after loadcampaigns : ",campaigns)
    }

    const handleCampaigns = (e) => {
        setCampaign(e.target.value)
        setSelectedProspects([])
        setCampaignHasChanged(prev => !prev)
    }

    const handleCheck = (e) => {
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat({'url':e.target.value, 'name':e.target.name}))
            console.log(e.target)
            console.log(e.target.checked)
        }else{
            console.log(e.target.checked)
            console.log(e.target.value)
            setSelectedProspects(selectedProspects.filter(el => el !== e.target.value))
            console.log(selectedProspects.filter(el => el !== e.target.value))
        }
        console.log(selectedProspects)
    }
    const handleCheckAll = (e) => {
        if(e.target.checked){
            setSelectedProspects(prospects.map(prospect => prospect.url))
            setIsCheckAll(true)
        }else{
            setSelectedProspects([])
            setIsCheckAll(false)
        }
        console.log("handlecheckAll : ", isCheckAll)

    }

    const openModal = () => {
        setShowModal(prev => !prev)
    }
    const handleDelete = async (campaignName, cookie) => {
        console.log("DELETE : ", campaignName)
        await fetch('api/deleteCamp',{
            method:'POST',
            body:JSON.stringify({campaignName, cookie})
        })
        loadCampaigns(cookie)
        setChanged('del')
    }

    useEffect(() => {
        console.log("cookie for useEffect loadprosp loadcamp : ", cookie)
        console.log("cookiesSession for useEffect loadprosp loadcamp : ", cookiesSession)
        loadProspects(campaign, cookie);
        loadCampaigns(cookie);
    }, [cookie, cookiesSession])

    useEffect(() => {
        loadProspects(campaign, cookie);
    }, [campaign])
    useEffect(() => {
        console.log("modal in campaign : ",showModal);
        loadCampaigns(cookie)
    }, [showModal])
    useEffect(() => {
        console.log("changed use effect trigger : ", changed)
        loadCampaigns(cookie)
        loadProspects(campaign, cookie);
    }, [changed])
    useEffect(() => {
        console.log(selectedProspects)
        
    }, [selectedProspects])
    

    return(
        <div className="bg-gray-200 p-4 border-black border-4 ml-48 overflow-x-hidden w-full h-screen">
            <Modal showModal={showModal} setShowModal={setShowModal} cookie={cookie} />

            <div className="flex flex-row m-2 mb-4 bg-gray-200">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => (
                            <option value={campaign.name}>{campaign.name}</option>
                        ))}
                        <option value="All" selected>Default Campaign</option>
                    </select>
                    <button onClick={openModal} className="p-2 px-3 mr-4 bg-blue-500 rounded">Create</button>
                    <button onClick={() => handleDelete(campaign, cookie)} className="p-2 px-3 mr-4 bg-red-500 rounded">Delete</button>
                    <button className="p-2 px-3 mr-4 bg-blue-500 rounded">Tools</button>
            </div>
            <div className="flex flex-row flex-wrap justify-between h-screen h-full">
                <ProspectList prospects={prospects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} handleCheckAll={handleCheckAll} isCheckAll={isCheckAll} />
                <TabPanel notes={notes} messages={messages} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} changed={changed} setChanged={setChanged} />
            </div>
            
            
        </div>
    )
}