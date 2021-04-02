import React, { useEffect, useState } from 'react'
import ProspectList from  '../components/ProspectList'
import TabPanel from '../components/TabPanel'
import Modal from '../components/createCampModal'


export default function Campaign({cookie, cookiesSession}){
    const [prospects, setProspects] = useState([]) 
    const [notes, setNotes] = useState([]) 
    const [messages, setMessages] = useState([])
    const [campaignHasChanged, setCampaignHasChanged] = useState(false)
    const [campaign, setCampaign] = useState('Default Campaign')
    const [campaigns, setCampaigns] = useState([])
    const [selectedProspects, setSelectedProspects] = useState([{}])
    const [showModal, setShowModal] = useState(false)
    const [changed, setChanged] = useState(false)
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [filter, setFilter] = useState([])
    const [filterProspects, setFilterProspects] = useState([])
    const [loadingProspects, setLoadingProspects] = useState(false)

    console.log("cookie in campaign pages : ", cookie)

    const loadProspects = async (campaign, cookie) => {
        try{
            setLoadingProspects(true)
            console.log("WHAT SI CAMPPPPAIG N : ", campaign)/*
            if(campaign == 'All'){
                const res = await fetch(`/api/campaigns`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
                setProspects(prospects.data)
            }else{*/
                const res = await fetch(`/api/campaigns/${campaign}`,{
                    method:'POST',
                    body:JSON.stringify(cookie)
                });
                const {prospects, notes, messages} = await res.json();
                setProspects(prospects.data.filter(prospect => prospect.url !== '' && prospect.url !== 'LinkedIn Member' && prospect.url !== 'Membre de LinkedIn' ))
                setNotes(notes.data)
                setMessages(messages.data)
            //}
            setLoadingProspects(false)

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
    const handleCheckFilter = (e) => {
        if(e.target.checked){
            console.log("filter : ",e.target.check)
            setFilter(filter => filter.concat(e.target.name))
            setFilterProspects([])
        }else{
            console.log("filterrr : ", e.target)
            setFilter(filter.filter(el => el !== e.target.name))
            setFilterProspects([])
        }
    }
    const handleCheck = (e) => {
        if(e.target.checked){
            setSelectedProspects(selectedProspects => selectedProspects.concat({'url':e.target.value, 'name':e.target.name}))
        }else{
            setSelectedProspects(selectedProspects.filter(el => el.url !== e.target.value))
        }
    }
    const handleCheckAll = (e) => {
        if(e.target.checked){
            setSelectedProspects([])
            setSelectedProspects(selectedProspects.concat(filterProspects.map(prospect => new Object({'url':prospect.url, 'name':prospect.name}))))
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

    const handleMessageFilter = (connect) => {
        if(!connect){
            console.log("message tab clicked")
            document.getElementById('Connected').checked = true
            document.getElementById('Has not responded').checked = true
            setFilter(filter => filter.concat("hasAccepted"))
            setFilter(filter => filter.concat("hasNotResponded"))
            setFilterProspects([])
        }else{
            console.log("connect tab clicked")
            document.getElementById('Connected').checked = false
            document.getElementById('Has not responded').checked = false
            setFilter([])
            setFilterProspects([])
        }
    }

    useEffect(() => {
        console.log("cookie for useEffect loadprosp loadcamp : ", cookie)
        console.log("cookiesSession for useEffect loadprosp loadcamp : ", cookiesSession)
        loadProspects(campaign, cookie);
        loadCampaigns(cookie);
        //setFilterProspects(selectedProspects)
    }, [cookie, cookiesSession])

    useEffect(() => {
        loadProspects(campaign, cookie);
        setFilterProspects([])
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
    useEffect(() => {
        console.log("this is filter : ",filter)
        console.log(filter.length)
        //filter.map(f => setFilterProspects(filterProspects.concat(prospects.filter(el => el.f))))
        for(let f of filter){
            if(f == "isNotConnected"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.isConnected == false)))
                console.log("is not co : ",prospects.filter(el => el.isConnected == false))
            }else if(f == "isConnected"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.isConnected == true)))
            }else if(f == "hasNotAccepted"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.hasAccepted == false)))
            }else if(f == "hasAccepted"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.hasAccepted == true)))
            }else if(f == "hasNotResponded"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.hasResponded == false)))
            }else if(f == "hasResponded"){
                setFilterProspects(filterProspects.concat(prospects.filter(el => el.hasResponded == true)))
            }
        }
        if(filter.length == 0){
            console.log("filter empty")
            setFilterProspects(prospects)
        }
    }, [filter, prospects])
    useEffect(() => {
        //setFilterProspects(prospects)
    }, [prospects])
    useEffect(() => {
        console.log("filter prospects : ",filterProspects)

    }, [filterProspects])
    //<option value="All" selected>Default Campaign</option>
    return(
        <div className="bg-gray-200 p-4 ml-48 overflow-x-hidden w-full h-screen">
            <Modal showModal={showModal} setShowModal={setShowModal} cookie={cookie} />

            <div className="flex flex-row m-2 mb-4 bg-gray-200 ">
                    <select onChange={handleCampaigns} name="pets" id="pet-select" className="p-2 w-5/12 mr-6 bg-red-300 rounded">
                        {campaigns.map(campaign => campaign == 'Default Campaign' ? 
                            (
                                <option selected value={campaign.name}>{campaign.name}</option>
                            )
                        : (
                            <option value={campaign.name}>{campaign.name}</option>
                            )
                        )}
                    </select>
                    <button onClick={openModal} className="p-2 px-3 mr-4 bg-blue-500 rounded">Create</button>
                    <button onClick={() => handleDelete(campaign, cookie)} className="p-2 px-3 mr-4 bg-red-500 rounded">Delete</button>
                    <button className="p-2 px-3 mr-4 bg-blue-500 rounded">Tools</button>
            </div>
            <div className="flex flex-row flex-wrap justify-between h-screen h-full">
                <ProspectList prospects={filterProspects} handleCheck={handleCheck} campaignHasChanged={campaignHasChanged} handleCheckAll={handleCheckAll} isCheckAll={isCheckAll} handleCheckFilter={handleCheckFilter} loadingProspects={loadingProspects} />
                <TabPanel notes={notes} messages={messages} campaign={campaign} loadProspects={loadProspects} selectedProspects={selectedProspects} cookie={cookie} changed={changed} setChanged={setChanged} campaignHasChanged={setCampaignHasChanged} handleMessageFilter={handleMessageFilter} />
            </div>
            
            
        </div>
    )
}