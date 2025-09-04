import React from "react";
import HighlightText from "../HomePage/HighlightText";
import Button from "../HomePage/CusButton";

const LearningGridArray = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highliteText: "Anyone, Anywhere",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
        BtnText: "Learn More",
        BtnLink: "/",
    },
    {

        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description:
            "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {


        order: 2,
        heading: "Our Learning Methods",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {


        order: 3,
        heading: "Certification",
        description: "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {

        order: 4,
        heading: `Reving "Auto-grauino"`,
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",

    }, {



        order: 5,
        heading: "Ready to Work",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    }
]

const LearningGrid = () => {
    return (
        <div className="grid w-11/12 grid-cols-1 lg:grid-cols-4 mb-10 ">
            {LearningGridArray.map((card, index) => {

                return (
                    <div key={index}
                        className={`${index == 0 && "lg:col-span-2 lg:h-[209px]"} 
                ${card.order % 2 === 1 ? "bg-gray-400" : "bg-white"}
                ${card.order === 3 && "lg:col-start-2 lg:h-[200px]"}
                ${index === 0 && "bg-transparent"}
                `}>
                        {
                            card.order < 0 ? (
                                <div className="flex flex-col items-center p-2 gap-2 mb-10">
                                    <div className="text-3xl font-bold text-gray-200">
                                        {card.heading}
                                        <HighlightText text={card.highliteText} />
                                    </div>
                                    <p className="text-gray-400 text-lg">{card.description}</p>
                                    <div className="w-[200px]">
                                        <Button active={true} link={card.BtnLink} >
                                            {card.BtnText}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center p-3 gap-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{card.heading}</h2>
                                    <p className="text-gray-700 text-lg">{card.description}</p>
                                </div>
                            )}
                    </div>
                )
            }
            )}
        </div>
    );
}

export default LearningGrid;