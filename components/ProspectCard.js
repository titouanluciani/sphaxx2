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

    //{prospect.isConnected == true ? (prospect.hasAccepted && prospect.hasAccepted == true ? 'Connected' : 'Connection in hold' ) : 'Connection not send'}<br/>{prospect.hasAccepted ? (prospect.hasResponded ? 'Has responded' : 'Has not responded yet' ) : ''}
    return (
            <tr className="">
                <td>
                    <input onClick={handleCheck} className="checkboxProspect" type="checkbox" id="checkbox" value={prospect.url} name={prospect.name} />
                </td>
                <td>
                    {prospect.prospectName ? prospect.prospectName : prospect.name}
                </td>
                <td className="break-all">
                    {prospect.prospectUrl ? prospect.prospectUrl : prospect.url}
                </td>
                <td>
                    {prospect.isConnected ? "Connection send" : "Connection not send"}<br/>
                    {prospect.hasAccepted ? "Connected" : (prospect.isConnected ? "Connection in hold" : "/" ) }<br/>
                    {prospect.hasResponded ? "Has responded" : "Has not responded yet"}
                </td>
                <td>
                    {prospect.campaign}
                </td>
            </tr>
           
    )
}