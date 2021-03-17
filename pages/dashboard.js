import { React, useEffect, useState } from 'react';

export default function Dashboard({ cookie, cookiesSession }){
    
    const monitore = async () => {
        await fetch('/api/monitoring', {
            method:'POST',
            body:JSON.stringify({ cookie, cookiesSession})
          })
    }

    return(
        <div className="ml-48 grid grid-cols-3 grid-rows-4 h-screen gap-1">
            <div className="bg-red-300 row-span-2">
                LinkedIn Stats
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
                <div className="flex flex-row text-center my-2">
                        <img width='32' height='32' src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-512.png" alt=""/>
                        <p className="ml-4">123</p>
                </div>
            </div>
            <div className="bg-blue-300 row-span-2 col-span-2">
                Global Performance
                <button className="inline-block ml-4 mt-2 bg-purple-500 p-1 rounded text-white" onClick={monitore()}>Refresh Stats</button>
            </div>
            <div className="bg-green-300 col-span-full row-span-2">
                Activity Report
            </div>
        </div>

    )
}