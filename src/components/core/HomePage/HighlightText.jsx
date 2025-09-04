import React from 'react'

const HighlightText = ({text}) => {
    return (
        <span className='bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent'>
            {" " + text + " "}
        </span>
    )
}

export default HighlightText;