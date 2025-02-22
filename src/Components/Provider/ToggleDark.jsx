import { FaMoon } from "react-icons/fa"
import { BsSunFill } from 'react-icons/bs'
import { useEffect, useState } from "react"


function ToggleDark() {
    const [darkmode, setDarkmode] = useState(true)

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme === 'dark') setDarkmode(true)
    }, [])

    useEffect(() => {
        if (darkmode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem("theme", "dark")
        }
        else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem("theme", "light")
        }
    }, [darkmode])

    return (
        <div className="relative w-16 h-8 flex items-center bg-gray-800  cursor-pointer rounded-full p-1"
            onClick={() => setDarkmode(!darkmode)}>
            <FaMoon
                className={`text-white rounded-full transition-opacity duration-300 ${darkmode ? 'opacity-100' : 'opacity-0'}`}
                size={22}
            />            <div className="absolute bd-white  w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300"
                style={darkmode ? { left: '2px' } : { right: '2px' }}>

            </div>
            <BsSunFill
                className={`ml-auto text-white transition-opacity duration-300 ${darkmode ? 'opacity-0' : 'opacity-100'}`}
                size={22}
            />

        </div>
    )
}

export default ToggleDark