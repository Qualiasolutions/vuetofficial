import { useGetUserFullDetailsQuery } from "reduxStore/services/api/user";

export default function ColourBar({userId}: {userId: number}) {

    const { data: userFullDetails } = useGetUserFullDetailsQuery(userId);
    const colourString = userFullDetails?.member_colour;
    const style = {
        backgroundColor: `#${colourString}`,
        width: '90px',
        height: '10px',
    }

    return <div style={style}></div>
}