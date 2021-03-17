export default function Pagination({ rowsPerPage, totalProspects, paginate }){
    const pageNumbers = []
    for(let i=1; i < Math.ceil( totalProspects / rowsPerPage );i++){
        pageNumbers.push(i)
    }
    console.log("this is pagenumbers : ",pageNumbers)
    return (
        <nav className="">
            <ul className="flex flex-row space-x-1">
                { pageNumbers.map(number => number == 1 ? (
                    <li className="" key={number} >
                        <button onClick={(e) => paginate(e,number)} href="" className="pageBtn bg-indigo-400 text-white p-2 rounded w-8 h-8 flex items-center justify-center hover:bg-indigo-800 active">{number}</button>
                    </li>
                ) : (
                    <li className="" key={number} >
                        <button onClick={(e) => paginate(e,number)} href="" className="pageBtn bg-indigo-400 text-white p-2 rounded w-8 h-8 flex items-center justify-center hover:bg-indigo-800">{number}</button>
                    </li>
                ) ) }
            </ul>
        </nav>
    )
}