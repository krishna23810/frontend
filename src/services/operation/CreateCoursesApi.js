import { createCourseApi } from '../apis';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { setStep, setCourse } from "../../slice/courseSlice"
import { getAllInstructorCourses } from "../operation/CoursesApi"
import { useDispatch } from 'react-redux';

const {
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    GET_ALL_COURSES_API,
    DELETE_COURSE_API,

    GET_COURSE_DETAILS_BY_ID_API,

    CREATE_SECTION_API,
    UPDATE_SECTION_API,
    DELETE_SECTION_API,
    GET_SECTIONS_API,

    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    GET_SUBSECTIONS_API,

    CREATE_RATING_API,
    GET_ALL_RATINGS_API } = createCourseApi;


export async function createCourse(categoryID,
    courseDuration,
    courseLevel,
    courseName,
    courseType,
    description,
    learnInCourse,
    price,
    tags,
    image,
    token,
    dispatch,
    setLoading) {

    console.log("Creating course with data:", {
        courseName, description, price, learnInCourse,
        courseLevel, courseDuration, courseType, categoryID, tags, image
    });
    const toastId = toast.loading("loading up...");
    setLoading(true);
    console.log("before creating courses ");

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('learnInCourse', learnInCourse);
    formData.append('courseLevel', courseLevel);
    formData.append('courseDuration', courseDuration);
    formData.append('courseType', courseType);
    formData.append('categoryID', categoryID);
    formData.append('tags', JSON.stringify(tags));

    // Append the image file
    if (image) {
        formData.append('image', image);
    }

    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, formData, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        });

        console.log("after creating courses ");
        console.log("Response data:", response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        dispatch(setStep(2));
        dispatch(setCourse(response.data.course));
        localStorage.setItem("course", JSON.stringify(response.data.course));
        toast.success("Course created successfully");
        console.log("Course created successfully", response.data);

        toast.dismiss(toastId);
        setLoading(false);
        return response.data;
    } catch (error) {
        console.error('Error creating courses:', error);
        toast.error('Failed to create courses');
        toast.dismiss(toastId);
        setLoading(false);
        throw error;
    }
}

export async function deleteCourse(courseId, token, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        console.log("Deleting course with ID:", courseId);
        const response = await apiConnector("DELETE", DELETE_COURSE_API + courseId, null, {
            Authorization: `Bearer ${token}`
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Course deleted successfully");
        console.log("Course deleted successfully", response.data);

        // Optionally, you can refresh the course list or perform other actions
        getAllInstructorCourses(token, dispatch);

        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function updateCourse(
    categoryID,
    courseDuration,
    courseLevel,
    courseName,
    courseType,
    description,
    learnInCourse,
    price,
    tags,
    image,
    token,
    dispatch,
    setLoading,
    courseId,
    status
) {
    const toastId = toast.loading("loading up...");
    // setLoading(true);
     const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('learnInCourse', learnInCourse);
    formData.append('courseLevel', courseLevel);
    formData.append('courseDuration', courseDuration);
    formData.append('courseType', courseType);
    formData.append('categoryID', categoryID);
    formData.append('tags', JSON.stringify(tags));
    formData.append('status', status);

    // Append the image file
    if (image) {
        formData.append('image', image);
    }

    try {
        console.log("before updating courses ");

        // Ensure thumbnailFile is appended to formData if provided

        const response = await apiConnector("PUT", EDIT_COURSE_API + courseId, formData, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        });
        console.log("after updating courses ");
        console.log("Response data:", response.data);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        const allCourses = await getAllInstructorCourses(token, dispatch);
        dispatch(setStep(2));

        dispatch(setCourse(response.data?.course));
        toast.success("Course updated successfully");
        console.log("Course updated successfully", response.data);

        toast.dismiss(toastId);
        // setLoading(false);
        return response.data;
    } catch (error) {
        console.error('Error updating courses:', error);
        toast.error('Failed to update courses');
        toast.dismiss(toastId);
        // setLoading(false);
        throw error;
    }
}

export async function addSection(data, token) {
    console.log("Adding section with data:", data);
    const toastId = toast.loading("Loading...");
    let responseData = null;
    
    try {
        const response = await apiConnector("POST", CREATE_SECTION_API, data,
            {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            });
        console.log("Response data:", response);
        
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || 'Failed to add section');
        }
        
        toast.success("Section added successfully");
        console.log("Section added successfully", response.data);
        
        responseData = response.data.section;
        return responseData;
    } catch (error) {
        console.error('Error adding section:', error);
        toast.error('Failed to add section');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function updateSection(editSectionName, sectionName, courseId, token) {
    console.log("Updating section with data:", editSectionName, sectionName);
    console.log("Token:", token);
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", UPDATE_SECTION_API + editSectionName, { title: sectionName },
            {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        try {
            const course = await getCourseById(courseId, token);
            console.log("course data:", course);

            if (!course.success) {
                throw new Error(course.data.message);
            }
            toast.success("Section updated successfully");
            return course?.course;
        } catch (error) {
            console.error('Error retrieving course data:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error updating section:', error);
        toast.error('Failed to update section');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function updateSubSection(data ,subsectionId, courseId, token) {
    console.log("we are in updateSubSection");
    const newFile = new File([data.videoFile], "video.mp4", { type: "video/mp4" });
        data.videoFile = newFile;

   data.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", UPDATE_SUBSECTION_API + subsectionId, data , {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
         if (!response.data.success) {
            throw new Error(response.data.message);
        }
        console.log("Response data:", response);
        try {
            const course = await getCourseById(courseId, token);
            console.log("course data:", course);

            if (!course.success) {
                throw new Error(course.data.message);
            }
            toast.success("Section updated successfully");
            return course?.course;
        } catch (error) {
            console.error('Error retrieving course data:', error);
            throw error;
        }
    } catch (error) {
        console.error("Error updating subsection:", error);
        toast.error("Failed to update subsection");
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function deleteSection(sectionId, courseId, token) {
    console.log("Deleting section with ID:", sectionId);
    console.log("Token:", token);
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", DELETE_SECTION_API + sectionId, {}, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        try{
            const course = await getCourseById(courseId, token);
            console.log("course data:", course);
            
            if (!course.success) {
                throw new Error(course.data.message);
            }
            toast.success("Section deleted successfully");
            return course?.course;
        } catch (error) {
            console.error('Error retrieving course data:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error deleting section:', error);
        toast.error('Failed to delete section');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function deleteSubsection(subsectionId, courseId,token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", DELETE_SUBSECTION_API + subsectionId, {}, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        try {
            const course = await getCourseById(courseId, token);
            console.log("course data:", course);

            if (!course.success) {
                throw new Error(course.data.message);
            }
            toast.success("Section updated successfully");
            return course?.course;
        } catch (error) {
            console.error('Error retrieving course data:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error deleting subsection:', error);
        toast.error('Failed to delete subsection');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function getCourseById(courseId, token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("GET", GET_COURSE_DETAILS_BY_ID_API + courseId, null, 
            // {
            // Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json'
        // }
    );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        // toast.success("Sections retrieved successfully");
        return response.data;
    } catch (error) {
        console.error('Error retrieving sections:', error);
        toast.error('Failed to retrieve sections');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function createSubsection(data, sectionId, courseId ,token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API + sectionId, data, {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - let the browser set it with boundary
        });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
       try {
            const course = await getCourseById(courseId, token);
            console.log("course data:", course);

            if (!course.success) {
                throw new Error(course.data.message);
            }
            toast.success("Lecture created successfully");
            return course?.course;
        } catch (error) {
            console.error('Error retrieving course data:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error creating subsection:', error);
        toast.error('Failed to create subsection');
        throw error;
    } finally {
        toast.dismiss(toastId);
    }
}
