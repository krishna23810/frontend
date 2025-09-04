import React from "react";


const Stats =[
    { label: "Active Courses", value: "10+" },
    { label: "Completed Lessons", value: "5000+" },
    { label: "Total Users", value: "1000+" },
    { label: "Mentors", value: "15+" }
]


const StateCompa = () => {
    return (
        <div>
            <div className="p-4 flex ">
                {
                    Stats.map((stat, index) => (
                        <div key={index} className="flex  flex-col  p-2 border-b border-gray-200 w-full">
                            <span className="font-bold text-2xl"  >{stat.value}</span>
                            <span className="text-gray-300 text-xl" >{stat.label}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default StateCompa;