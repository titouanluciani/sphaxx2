import { React, useEffect, useState } from 'react';

export default function Dashboard({ cookie, cookiesSession }){
    

    return(
        <div className="ml-48 grid grid-cols-3 grid-rows-4 border-black border-4 h-screen gap-1">
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
            </div>
            <div className="bg-green-300 col-span-full row-span-2">
                Activity Report
            </div>
        </div>

    )
}