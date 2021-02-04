import Link from 'next/link';
import Image from 'next/image';


export default function NavBlock({data}){
    return(
				data.map(el => (
						<div className="">
							<Link href={el.page}>
								<a className="flex hover:bg-red-900 rounded transition h-12 ease-in-out duration-200 justify-between items-center flex-row flex-1">
									<div className="px-3 flex items-center object-contain bg-opacity-50 justify-self-stretch self-center h-full bg-red-500 rounded">
										<img src={el.icon} width="16" height="16" className=""/>
									</div>
									<p className="px-2 flex-1 text-sm inline-block">{el.name}</p>
									<p className="px-2 text-sm inline-block">{el.number}</p>
								</a>
							</Link>
						</div>
				))
    )
}