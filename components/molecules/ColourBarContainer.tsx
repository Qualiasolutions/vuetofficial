export default function ColourBar({children}: {children: React.ReactNode}) {

    return <div style={{position:'absolute', bottom: 0, right: 0, height: '10px', display:'flex', flexDirection:'row-reverse', width:'100%'}}>
        {children}
    </div>
}