import React from "react";
import { HiUsers } from "react-icons/hi";
import { LuFileVideo } from "react-icons/lu";

const CourseCard = ({ key, cardData, currentCard, setCurrentCard }) => {
    const handleCardClick = () => {
        setCurrentCard(cardData.heading);
    }
    
    return (
        <div className={`flex flex-col justify-between ${currentCard === cardData.heading ? "bg-white " : "bg-gray-800"} pl-4 pr-4 w-[250px] h-[230px] z-10`} onClick={handleCardClick}>
            <h3 className={`text-lg font-bold pt-3 ${currentCard === cardData.heading ? "text-black" : "text-white"}`}>{cardData.heading}</h3>
            
            <p className={`text-sm font-bold ${currentCard === cardData.heading ? "text-gray-800" : "text-gray-400"}`}>{cardData.description}</p>
            <div className={`flex justify-between text-sm pb-2 font-bold ${currentCard === cardData.heading ? "text-gray-800" : "text-gray-400"}`}>
                <p><HiUsers className="inline-block mr-1" />{cardData.level}</p>
                <p><LuFileVideo className="inline-block mr-1 " />{cardData.lessionNumber} Lessons</p>
            </div>

        </div>
    );
};

export default CourseCard;
