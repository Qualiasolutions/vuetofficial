import { View } from "react-native";

export default function ColourBar({colourHexcodes}: {colourHexcodes: string[]}) {

    const containerStyle = {
        bottom: 0,
        right: 0,
        height: '10px',
        display:'flex',
        'flex-direction':'row-reverse',
        width:'100%',
        position: 'absolute',
    }

    const getBarStyle = (colourHex: string) => {
        return ({
            backgroundColor: `#${colourHex}`,
            width: '90px',
            height: '10px',
        })
    }
  
    const bars =  colourHexcodes.map((colour: string) => {
        return <View style={getBarStyle(colour)}></View> 
    });

    return <View style={containerStyle}>{bars}</View>
}