import CourseCard from "./CourseCard";
import { useState } from "react";
import { HomePageExplore } from "../../../data/HomePageExplore";

const tableName = ["Free", "New to coding", "Most popular", "Skills paths", "Career paths"];
export const Explore = () => {
    const [currentTable, setCurrentTable] = useState(tableName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyTable = (table) => {
        setCurrentTable(table);
        const selectedTable = HomePageExplore.find(course =>
            course.tag === table
        );
        if (selectedTable) {
            setCourses(selectedTable.courses);
            setCurrentCard(selectedTable.courses[0].heading);
        }
    }

    return (
        <div className="relative h-[210px]">
            <div className=" flex flex-row items-center justify-center my-2 font-semibold bg-gray-600  rounded-lg">
                {
                    tableName.map((table, index) => {
                        return (
                            <div key={index}>
                                <button
                                    key={index}
                                    className={`px-4 py-2 m-2 rounded-lg ${currentTable === table ? "bg-blue-500 text-white" : "bg-gray-300 "}`}
                                    onClick={() => setMyTable(table)}
                                >
                                    {table}
                                </button>
                            </div>

                        )
                    })
                }
            </div>
            <div className="flex my-4 absolute gap-10 -left-20 z-10 pt-3">

                {courses.map((course, index) => {
                    return (
                        <div>

                            <CourseCard
                                key={index}
                                cardData={course}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                            />
                            </div>
                    );
                })}

                            <div className={`bg-red-600 absolute top-5  left-2 -z-10 pl-4 pr-4 w-[250px] h-[230px]`}>
                </div>
            </div>
        </div>
    );
}

export default Explore; 
