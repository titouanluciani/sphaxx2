import NavBlock from './NavBlock'
//import home from 
import Image from 'next/image'


const data = [{
    name:"Dashboard",
    icon:'https://cdn0.iconfinder.com/data/icons/very-basic-android-l-lollipop-icon-pack/24/home-512.png',
    number:null,
    page:"/dashboard"
},{
    name:"Campaigns",
    icon:"https://cdn2.iconfinder.com/data/icons/seo-flat-6/128/25_Campaign_Launch-512.png",
    number:10,
    page:"/campaign"
},{
    name:"Funnel",
    icon:"https://cdn1.iconfinder.com/data/icons/youtuber/256/storytelling-storyboard-scenario-script-screenplay-512.png",
    number:null,
    page:"/funnel"
},{
    name:"Waiting Line",
    icon:"https://cdn2.iconfinder.com/data/icons/font-awesome/1792/hourglass-o-512.png",
    number:10,
    page:"/waitingLine"
},{
    name:"Prospects",
    icon:"https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-512.png",
    number:10,
    page:"/prospects"
},{
    name:"Dashboard",
    icon:'https://cdn0.iconfinder.com/data/icons/very-basic-android-l-lollipop-icon-pack/24/home-512.png',
    number:null,
    page:"/Dashboard"
},{
    name:"Campaigns",
    icon:"https://cdn2.iconfinder.com/data/icons/seo-flat-6/128/25_Campaign_Launch-512.png",
    number:10,
    page:"/"
},{
    name:"Scenario",
    icon:"https://cdn1.iconfinder.com/data/icons/youtuber/256/storytelling-storyboard-scenario-script-screenplay-512.png",
    number:null,
    page:"/Scenario"
},{
    name:"Waiting Line",
    icon:"https://cdn2.iconfinder.com/data/icons/font-awesome/1792/hourglass-o-512.png",
    number:10,
    page:"/WaitingLine"
},{
    name:"Prospects",
    icon:"https://cdn0.iconfinder.com/data/icons/users-android-l-lollipop-icon-pack/24/group2-512.png",
    number:10,
    page:"/Prospects"
}]

export default function Navbar(){
    return(
        <div className="h-screen fixed bg-red-100 flex flex-col justify-between space-y-8 w-48">
            <div className="overflow-y-auto divide-y-2 divide-opacity-10 divide-black">
                <h1 className="my-4 text-2xl text-center">Sphaxx</h1>
                <div className="flex flex-col items-center py-6">
                    <Image src="/pp.png" width="64" height="64" alt="pp" className=""/>

                    <h2 className="mt-3 mb-0"> Titouan Luciani </h2>
                </div>
                <div className="flex flex-col items-stretch py-6">
                    <NavBlock data={data}/>
                </div>
                <div className="flex flex-col items-stretch py-6">
                    <NavBlock data={data}/>
                </div>
            
            </div>
            
        </div>
    )
}