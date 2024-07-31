import React from 'react'
import { useEffect, useState } from 'react'

function Navbar(props) {
    const { links, peop2, prop3 } = props
    const [numbers, setNumbers] = useState(1)

    const onload = () => {
        console.log("test")
        console.log(numbers)
        setNumbers((x) => (x + 1))
        console.log(numbers)
    }
    useEffect(() => {
        console.log(links)
        onload()
    }, [])
    return (
        <div>Navbar</div>
    )
}

export default Navbar