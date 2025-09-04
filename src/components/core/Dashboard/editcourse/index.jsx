import { useParams } from "react-router-dom";
import Steps from './Steps'
import { useEffect ,useState } from "react";
import {getCourseById} from "../../../../services/operation/CreateCoursesApi";
import { useDispatch } from "react-redux";
import { setCourse, setEditCourse } from "../../../../slice/courseSlice";



export default function EditCourse() {
    let {courseId} = useParams();
    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    courseId = courseId.split("=").at(-1);
    console.log("Editing course with ID:", courseId);

    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            const courseData = await getCourseById(courseId);
            console.log("Fetched course data:", courseData);
            if(courseData.success) {
                dispatch(setEditCourse(true));
                dispatch(setCourse(courseData?.course));
            }
            setLoading(false);
        };
        fetchCourseData();
    }, []);

  return (
    <div>
      <h1>Edit Course</h1>
      <Steps />
    </div>
  );
}
