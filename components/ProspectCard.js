import React, { useEffect } from 'react';

export default function ProspectCard({ prospect, handleCheck,campaignHasChanged, isCheckAll }){
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = false
        })
    }, [campaignHasChanged])
    useEffect(() => {
        Array.from(document.getElementsByClassName('checkboxProspect')).forEach(el =>  {
            el.checked = isCheckAll
        })
    }, [isCheckAll])

    
    return (
            <tr className="border-gray-300">
                <td>
                    <input onClick={handleCheck} className="checkboxProspect" type="checkbox" id="checkbox" value={prospect.url} name={prospect.name} />
                </td>
                <td>
                    {prospect.prospectName ? prospect.prospectName : prospect.name}
                </td>
                <td className="break-all border-black border-2">
                    {prospect.prospectUrl ? prospect.prospectUrl : prospect.url}
                </td>
                <td>
                    {prospect.action ? prospect.action : prospect.campaign}
                </td>
                <td>
                    {prospect.campaign}
                </td>
            </tr>
           
    )
}