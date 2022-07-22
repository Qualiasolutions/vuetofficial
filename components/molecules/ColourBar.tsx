import { useGetUserFullDetailsQuery } from "reduxStore/services/api/user";

export default function ColourBar({colourHex}: {colourHex: string}) {

    const style = {
        backgroundColor: `#${colourHex}`,
        width: '90px',
        height: '10px',
    }

    return <div style={style}></div>
}