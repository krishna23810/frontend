import React from "react";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { LuIndianRupee } from "react-icons/lu";


const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};


const Course_Card = ({ course, Height }) => {
    const value = course.averageRating;

    console.log("course", course);

    return (
        <div>
            <Link to={`/course/${course.id}`}>
                <div>
                    <div>
                        <img src={course.image} alt="Thumbnail"
                            className={`w-full ${Height} object-cover rounded-xl`}
                        />
                    </div>
                    <div>
                        <p>{course.courseName}</p>
                        <p>By {course?.instructorId?.firstName} {course?.instructorId?.lastName}</p>
                        <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                            <Rating
                                name="text-feedback"
                                value={value}
                                readOnly
                                precision={0.5}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            <Box sx={{ ml: 2 }} className="text-sm text-gray-500 flex"><p>{labels[value]}</p> <p className="mx-1">|</p> <p className="mx-1">{course.totalRatings}</p> ratings</Box>
                            {/* <span>{course.totalRatings} ratings</span> */}
                        </Box>
                        {/* <div> */}
                            {/* <span></span> */}
                            {/* <Rating/> */}
                            {/* <span></span> */}
                        {/* </div> */}
                        <p className="flex items-center"><LuIndianRupee /> {course.price}</p>
                    </div>
                    
                </div>
            </Link>
        </div>
    )
}

export default Course_Card;