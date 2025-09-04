import React from 'react'
import CliButton from './CusButton';
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({
    position, Heading, subHeading, butt1, butt2, codeblock, backgroundgradient, codeColor
}) => {
    return (
        <div className={`${position} flex flex-col items-center justify-center w-8/12 h-[500px]`}>
            <div className='flex flex-col w-[50%] gap-10 mx-20 text-white'>
                {Heading}
                <div className='text-2xl font-semibold text-gray-400'>
                    {subHeading}
                </div>
                <div className='flex items-center gap-10'>
                    <CliButton Linkto={butt1.link} active={butt1.active} >
                        <div className='flex items-center justify-center gap-2'>
                            {butt1.text}
                            <FaArrowRight />
                        </div>
                    </CliButton>
                    <CliButton Linkto={butt2.link} active={butt2.active} >
                        {butt2.text}
                    </CliButton>
                </div>
            </div>

            <div className={`h-fit flex flex-row gap-2 w-[100%] lg:w-[500px] ${position==="lg:flex-row"?"border-l-2":"border-r-2"} border-red-300 shadow-sm `}>
                <div className='text-center flex flex-col text-gray-400 font-inter font-semibold  gap-2 w-[10%] leading-[1.159]'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div className={` w-[90%] flex flex-col gap-2 font-mono pr-2 font-semibold ${codeColor} `}>
                    <TypeAnimation
                        sequence={[codeblock ,2000 ,""]}
                        cursor={true}
                        repeat={Infinity}
                        omitDeletionAnimation={true}

                        style={{
                            //add gap between lines
                            lineHeight: "1.6",
                            whiteSpace: "pre-line",
                            display: "block",
                        }}
                    />
                </div>
            </div>

        </div>
    )
}

export default CodeBlocks;