import React, { useEffect, useState } from 'react'

export default function Connect(props){
    console.log("notes in connect components", props.notes)
    const [option, setOptionNote] = useState('')
    const [description, setDescription] = useState('')
    const [oldDescription, setOldDescription] = useState('')
    const [oldName, setOldName] = useState('')
    const [doc, setDoc] = useState('')
    const [waitingLine, setWaitingLine] = useState(0)

    const handleSave = async (name, oldName, description, campaign, connect, cookie) => {
        console.log("wtf is happenning :",name, description, cookie)
        await fetch('/api/saveNote', {
            method:'POST',
            body:JSON.stringify({name, oldName, description, campaign, connect, cookie})
        })
        await props.loadProspects(campaign)
        setOptionNote(document.getElementById('selectInput').value)
        setOldName(document.getElementById('noteSelect').value)
        props.notes.map(note => note.name === document.getElementById('noteSelect').value ? setOldDescription(note.description) : '')
        setDescription(description)
        document.getElementById('textarea').value = description
        document.getElementById('selectInput').value = option
        props.setChanged(prev => !prev)

        
    }
    

    const handleLaunch = async (campaign, selectedProspects, option, description, connect, oldName, cookie, action) => {
        
        await handleSave(option,oldName,description, campaign, connect, cookie);
        await fetch('/api/launchConnect', {
            method:'POST',
            body:JSON.stringify({campaign, selectedProspects, option, description, connect, cookie, action})
        })
        const todo_res = await fetch('api/todo', {
            method:"POST",
            body: JSON.stringify(cookie)
        })
        const todo = await todo_res.json()
        console.log(todo)
        console.log(todo.data[0])
        setWaitingLine(todo.data[0])
        console.log("waiting line : ",waitingLine)
        props.setChanged(prev => !prev)


    }

    const handleNewNote = async (cookie, campaign, connect) => {
        console.log("New note clicked ")
        const note_res = await fetch('api/newNote', {
            method:"POST",
            body:JSON.stringify({cookie, campaign, connect})
        })
        const note = note_res.json()
        console.log("new note created : ", note)
        props.setChanged(prev => !prev)
        return note
    }   
    const handleDelete = async (cookie, campaign, name, connect) => {
        console.log("Delete note clicked ")
        const note_res = await fetch('api/deleteNote', {
            method:"POST",
            body:JSON.stringify({cookie, campaign, name, connect})
        })
        const note = note_res.json()
        console.log("note deleted : ", note)
        props.setChanged(prev => !prev)
        return note
    } 
    const handleName = async (e) => {
        console.log(e.target)
        document.getElementById('textarea').value += e.target.value
    }
    useEffect(()=> setDoc(document.getElementById('noteSelect').value),[])
    useEffect(() => {
        setOptionNote(document.getElementById('noteSelect').value)
        setOldName(document.getElementById('noteSelect').value)
        props.notes.map(note => note.name === document.getElementById('noteSelect').value ? setOldDescription(note.description) : '')
        props.notes.map(note => note.name === document.getElementById('noteSelect').value ? setDescription(note.description) : '')
                    
    }, [doc])
    
    useEffect(()=>{
        document.getElementById('count').innerHTML = "Characters left: " + (299 - description.length);
        
    },[description])
    /*document.getElementById('textarea').onkeyup = function () {
        document.getElementById('count').innerHTML = "Characters left: " + (299 - this.value.length);
    };*/
    return(
        <div className="w-full border-black border-2 h-full">
            <div className="flex flex-row justify-center">
                <select onChange={e => {
                    setOptionNote(e.target.value)
                    setOldName(e.target.value)
                    props.notes.map(note => note.name === e.target.value ? setOldDescription(note.description) : '')
                    props.notes.map(note => note.name === e.target.value ? setDescription(note.description) : '')
                    console.log("desc ",description, document.getElementById('textarea').value)
                    document.getElementById('count').innerHTML = "Characters left: " + (299 - document.getElementById('textarea').value.length);

                    }} name="note" id="noteSelect" className="w-1/2 m-2 p-2 rounded">
                    <option value={props.notes[0] ? props.notes[0].name : "Default Note"} selected>{props.notes[0] ? props.notes[0].name : "Default Note"}</option>
                    {props.notes.map(note => {
                        return <option value={note.name}>{note.name}</option>
                    })}
                </select>
                <button onClick={() => handleNewNote(props.cookie, props.campaign, props.connect.toString())} className="m-2 p-2 w-1/3 bg-red-500 rounded">{props.connect ? "Add note" : "Add message"}</button>
                
            </div>
            <div className="flex flex-row bg-red-100 justify-between">
                <input onChange={e => setOptionNote(e.target.value)} type="text" value={option} placeholder={option} id="selectInput" className="p-2 m-2 rounded"/>
                <button onClick={() => handleSave(option,oldName,oldDescription, props.campaign, props.connect.toString(), props.cookie)} className="m-2 p-2 w-1/3 bg-red-500 rounded">Save</button>
                <button onClick={() => handleDelete(props.cookie, props.campaign, oldName, props.connect.toString())} className="m-2 p-2 w-1/3 bg-red-500 rounded">Delete</button>
            </div>
            <div className="bg-red-300 flex flex-row justify-around">
                <textarea id='textarea' value={description.toString()} onChange={e => {
                    console.log(e.target.value)
                    setDescription(e.target.value.toString())
                    document.getElementById('count').innerHTML = "Characters left: " + (299 - e.target.value.length);
                    console.log(description)
                    }} cols="30" rows="7" className="w-2/3 h-full m-4 rounded"> { description } </textarea>
                <div className="flex flex-col justify-evenly items-stretch bg-red-100">
                    <button className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded" onClick={handleName} value='{{name}}'>Name</button>
                    <button className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded" onClick={handleName} value='{{firstname}}'>FirstName</button>
                    <button disabled className="bg-red-500 h-1/4 p-4 flex items-center justify-center rounded">Smileys</button>
                </div>
            </div>
            <h4 className="" id="count">Characters left: {299 - description.length}</h4>
            <button onClick={() => handleSave(option,oldName,description.toString(), props.campaign, props.connect.toString(), props.cookie)} className="m-2 p-2 w-1/3 bg-red-500 rounded text-white">Save</button>
            <button onClick={() => handleLaunch(props.campaign, props.selectedProspects, option, description.toString(), props.connect.toString(), oldName, props.cookie, props.connect ? 'connect' : 'message')} className="m-2 p-2 w-1/3 bg-blue-700 rounded text-white">Launch</button>
        </div>
        
    )
}