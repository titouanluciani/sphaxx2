import React, { useEffect, useState } from 'react'

export default function Connect(props){
    console.log("notes in connect components", props.notes)
    const [option, setOptionNote] = useState('')
    const [description, setDescription] = useState('')
    const [oldDescription, setOldDescription] = useState('')
    const [oldName, setOldName] = useState('')
    const [doc, setDoc] = useState('')

    const handleSave = async (name, oldName, description, campaign, connect) => {
        console.log("wtf is happenning :",name, description)
        await fetch('/api/saveNote', {
            method:'POST',
            body:JSON.stringify({name, oldName, description, campaign, connect})
        })
        await props.loadProspects(campaign)
        setOptionNote(document.getElementById('noteSelect').value)
        setOldName(document.getElementById('noteSelect').value)
        setOldDescription(props.notes.map(note => note.name === document.getElementById('noteSelect').value ? note.description : ''))
        setDescription(props.notes.map(note => note.name === document.getElementById('noteSelect').value ? note.description : ''))
        console.log("current note desc : ", option)
        console.log("current note desc : ", description)
        console.log("current note desc : ", document.getElementById('textarea').value)
        document.getElementById('textarea').value = description
        document.getElementById('selectInput').value = option
        
    }
    useEffect(()=> setDoc(document.getElementById('noteSelect').value),[])
    useEffect(() => {
        setOptionNote(document.getElementById('noteSelect').value)
        setOldName(document.getElementById('noteSelect').value)
        setOldDescription(props.notes.map(note => note.name === document.getElementById('noteSelect').value ? note.description : ''))
        setDescription(props.notes.map(note => note.name === document.getElementById('noteSelect').value ? note.description : ''))
                    
    }, [doc])

    const handleLaunch = async (campaign, selectedProspects, option, description, connect, oldName, action) => {
        console.log("launch clicked")
        console.log("prospects selected : ", props.selectedProspects)
        await handleSave(option,oldName,description, campaign, connect);
        await fetch('/api/launchConnect', {
            method:'POST',
            body:JSON.stringify({campaign, selectedProspects, option, description, connect, action})
        })
    }

    return(
        <div className="w-full border-black border-2 h-full">
            <div className="flex flex-row justify-center">
                <select onChange={e => {
                    setOptionNote(e.target.value)
                    setOldName(e.target.value)
                    setOldDescription(props.notes.map(note => note.name === e.target.value ? note.description : ''))
                    setDescription(props.notes.map(note => note.name === e.target.value ? note.description : ''))
                    }} name="note" id="noteSelect" className="w-1/2 m-2 p-2 rounded">
                    <option value={props.notes[0] ? props.notes[0].name : "Default Note"} selected>{props.notes[0] ? props.notes[0].name : "Default Note"}</option>
                    {props.notes.map(note => {
                        return <option value={note.name}>{note.name}</option>
                    })}
                </select>
                <button className="m-2 p-2 w-1/3 bg-red-500 rounded">{props.connect ? "Add note" : "Add message"}</button>
                
            </div>
            <div className="flex flex-row bg-red-100 justify-between">
                <input onChange={e => setOptionNote(e.target.value)} type="text" value={option} placeholder={option} id="selectInput" className="p-2 m-2 rounded"/>
                <button onClick={() => handleSave(option,oldName,oldDescription, props.campaign, props.connect.toString())} className="m-2 p-2 w-1/3 bg-red-500 rounded">Save</button>
                <button className="m-2 p-2 w-1/3 bg-red-500 rounded">Delete</button>
            </div>
            <div className="bg-red-300 flex flex-row justify-around">
                <textarea id='textarea' value={description.toString()} onChange={e => {
                    setDescription(e.target.value.toString())
                    console.log(description)
                    }} placeholder={description} cols="30" rows="7" className="w-2/3 h-full m-4 rounded"> { description } </textarea>
                <div className="flex flex-col justify-evenly items-stretch bg-red-100">
                    <button className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded">Name</button>
                    <button className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded">FirstName</button>
                    <button className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded">Smileys</button>
                </div>
            </div>
            <h4 className="">Available : 150</h4>
            <button onClick={() => handleSave(option,oldName,description.toString(), props.campaign, props.connect.toString())} className="m-2 p-2 w-1/3 bg-red-500 rounded text-white">Save</button>
            <button onClick={() => handleLaunch(props.campaign, props.selectedProspects, option, description.toString(), props.connect.toString(), oldName, props.connect ? 'connect' : 'message')} className="m-2 p-2 w-1/3 bg-blue-700 rounded text-white">Launch</button>
        </div>
        
    )
}