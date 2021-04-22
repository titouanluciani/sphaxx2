import React, { useEffect, useState } from 'react'
//<option value={props.notes[0] ? props.notes[0].name : "Default Note"} selected>{props.notes[0] ? props.notes[0].name : "Default Note"}</option>
//<input onClick={() => handleSave(option,oldName,oldDescription, props.campaign, props.connect.toString(), props.cookie)} className="m-2 p-0.5 w-1/2 bg-blue-500 rounded-full" type="image" src="https://cdn1.iconfinder.com/data/icons/feather-2/24/check-512.png" width="32" height="32"/>
//<input onClick={() => handleDelete(props.cookie, props.campaign, oldName, props.connect.toString())} type="image" src="https://cdn3.iconfinder.com/data/icons/user-interface-169/32/cross-512.png"  className="m-2 p-0.5 w-1/2 bg-red-500 rounded-full" width="16" height="16"/>
export default function Connect(props){
    console.log("notes in connect components", props.notes)
    const [option, setOptionNote] = useState('')
    const [description, setDescription] = useState('')
    const [oldDescription, setOldDescription] = useState('')
    const [oldName, setOldName] = useState('')
    const [doc, setDoc] = useState('')
    const [waitingLine, setWaitingLine] = useState(0)

    const handleSave = async (name, oldName, description, campaign, connect, cookie) => {
        console.log("wtf is happenning :",name, oldName , description, cookie)
        await fetch('/api/saveNote', {
            method:'POST',
            body:JSON.stringify({name, oldName, description, campaign, connect, cookie})
        })
        await props.loadProspects(campaign)
        setOptionNote(document.getElementById('selectInput').value)
        setOldName(document.getElementById('selectInput').value)
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
        setOptionNote("New note")
        setOldName("New note")
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
        setDescription(document.getElementById('textarea').value)
    }
    /*useEffect(()=> setDoc(document.getElementById('noteSelect').value),[])
    useEffect(() => {
        setOptionNote(document.getElementById('noteSelect').value)
        setOldName(document.getElementById('noteSelect').value)
        props.notes.map(note => note.name === document.getElementById('noteSelect').value ? setOldDescription(note.description) : '')
        props.notes.map(note => note.name === document.getElementById('noteSelect').value ? setDescription(note.description) : '')
                    
    }, [doc])*/
    
    useEffect(()=>{
        document.getElementById('count').innerHTML = "Characters left: " + (299 - description.length);
        
    },[description])
    /*document.getElementById('textarea').onkeyup = function () {
        document.getElementById('count').innerHTML = "Characters left: " + (299 - this.value.length);
    };*/
    useEffect(()=>{        
        setOptionNote(document.getElementById('noteSelect').value)
        document.getElementById('selectInput').value = document.getElementById('noteSelect').value
        setDescription('')
        props.notes.filter(note => note.name === document.getElementById('noteSelect').value ? setOldDescription(note.description) : '')
        props.notes.filter(note => note.name === document.getElementById('noteSelect').value ? setDescription(note.description) : '')
    },[props.notes])
    useEffect(() => {
        props.handleMessageFilter(props.connect)
    }, [])
    return(
        <div className="w-full">
            <div className="flex flex-row justify-between mb-2 px-2 py-3 bg-red-300 rounded">
                <div className="w-1/2">
                    <h2 className="">Your notes : </h2>
                    <select onChange={e => {
                        setOptionNote(e.target.value)
                        setOldName(e.target.value)
                        props.notes.map(note => note.name === e.target.value ? setOldDescription(note.description) : '')
                        props.notes.map(note => note.name === e.target.value ? setDescription(note.description) : '')
                        console.log("desc ",description, document.getElementById('textarea').value)
                        document.getElementById('count').innerHTML = "Characters left: " + (299 - document.getElementById('textarea').value.length);

                        }} name="note" id="noteSelect" className="w-full m-2 p-2 rounded">
                        {props.notes.map(note => {
                            return <option value={note.name}>{note.name}</option>
                        })}
                    </select>
                </div>
                <button onClick={() => handleNewNote(props.cookie, props.campaign, props.connect.toString())} className="m-2 p-2 w-1/3 h-9 bg-gray-100 text-indigo-600 rounded self-end">{props.connect ? "Add note" : "Add message"}</button>
                
            </div>
            <div className="flex flex-row justify-between items-end bg-indigo-300 p-2 py-3 rounded">
                <div className="">
                    <h2 className="mb-2" >Update your note's title : </h2>
                    <input onChange={e => setOptionNote(e.target.value)} type="text" value={option} placeholder={option} id="selectInput" className="p-2 mx-2 rounded"/>
                </div>
                <button onClick={() => handleDelete(props.cookie, props.campaign, oldName, props.connect.toString())} className="m-2 p-2 w-1/3 h-9 bg-gray-100 text-white bg-red-400 rounded self-end">Delete</button>
            </div>
            <div className=" flex flex-row justify-around bg-red-300 my-3 rounded p-2 py-3">
                <div className="h-30 rounded">
                    <h2 className="" >Update your note's content : </h2>
                    <textarea id='textarea' value={description.toString()} onChange={e => {
                        console.log(e.target.value)
                        setDescription(e.target.value.toString())
                        document.getElementById('count').innerHTML = "Characters left: " + (299 - e.target.value.length);
                        console.log(description)
                        }} cols="30" rows="7" className="w-full m-2 rounded p-1"> { description } </textarea>
                    <h4 className="" id="count">Characters left: {299 - description.length}</h4>
                </div>
                <div className="flex flex-col justify-evenly items-stretch ml-4">
                    <button className="bg-gray-100 text-indigo-600 h-10 p-2 w-24  items-center justify-center rounded" onClick={handleName} value='{{name}}'>Name</button>
                    <button className="bg-gray-100 text-indigo-600 h-10 p-2 w-24 items-center justify-center rounded" onClick={handleName} value='{{firstname}}'>FirstName</button>
                </div>
            </div>
            <button onClick={() => handleSave(option,oldName,description.toString(), props.campaign, props.connect.toString(), props.cookie)} className="m-2 p-2 w-1/3 bg-blue-500 rounded text-white">Save Note</button>
            <button onClick={() => handleLaunch(props.campaign, props.selectedProspects, option, description.toString(), props.connect.toString(), oldName, props.cookie, props.connect ? 'connect' : 'message')} className="m-2 ml-8 p-2 w-1/2 bg-purple-700 rounded text-white">Save & Launch</button>
        </div>
        
    )
}