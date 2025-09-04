

const BASE_URL = process.env.REACT_APP_BASE_URL

export const categoriesApi = {

    CATEGORIES_API: BASE_URL + '/course/showAllCategories',
    CATEGORIES_PAGE_API: BASE_URL + '/course/categoryPageDetails',
    GET_AVERAGE_RATING_API: BASE_URL + '/course/get-average-rating/:courseId',
    
    // routes.get('/categoryPageDetails', categoryPageDetail);
}

export const endpoints = {
    SEND_OTP_API: BASE_URL + '/auth/sendotp',
    SIGNUP_API: BASE_URL + '/auth/signup',
    LOGIN_API: BASE_URL + '/auth/login',
    RESET_PASSWORD_TOKEN_API: BASE_URL + '/auth/resetpassword-token',
    RESET_PASSWORD_API: BASE_URL + '/auth/resetpassword',
    CHANGE_PASSWORD_API: BASE_URL + '/auth/changepassword',
    CONTACT_US_API: BASE_URL + '/about/contact',
}
export const profileApi = {

    UPDATE_PROFILE_API: BASE_URL + '/profile/updateProfile',
    DELETE_ACCOUNT_API: BASE_URL + '/profile/deleteAccount',
    GET_USER_DETAILS_API: BASE_URL + '/profile/getUserDetails',
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + '/profile/updateDisplayPicture',
    INSTRUCTOR_DASHBOARD_API: BASE_URL + '/profile/instructorDashboard',
}

//profile Endpoints
export const coursesEndpoints = {
    GET_USER_ENROLLED_COURSES_API: BASE_URL + '/profile/getUserEnrolledCourses',
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + '/course/getAllInstructorCourses'
}

export const createCourseApi = {
    CREATE_COURSE_API: BASE_URL + '/course/createCourse',
    EDIT_COURSE_API: BASE_URL + '/course/editCourse/',
    // GET_COURSE_DETAILS_API: BASE_URL + '/course/getCourseDetails/',
    GET_ALL_COURSES_API: BASE_URL + '/course/getAllCourses',
    DELETE_COURSE_API: BASE_URL + '/course/deleteCourse/',

    GET_COURSE_DETAILS_BY_ID_API: BASE_URL + "/course/getCourseDetails/",
    // routes.get('/getCourseDetails/:courseId', getCourseById);

    CREATE_SECTION_API: BASE_URL + "/course/addSection",
    UPDATE_SECTION_API: BASE_URL + "/course/updateSection/",
    DELETE_SECTION_API: BASE_URL + "/course/deleteSection/",
    GET_SECTIONS_API: BASE_URL + "/course/getSections/",

    CREATE_SUBSECTION_API: BASE_URL + "/course/createSubsection/",
    UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubsection/",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubsection/",
    GET_SUBSECTIONS_API: BASE_URL + "/course/getSubsections/",

    CREATE_RATING_API: BASE_URL + "/course/create-rating",
    GET_ALL_RATINGS_API: BASE_URL + "/course/get-all-ratings/",
}

export const paymentApi = {
    CAPTURE_PAYMENT_API: BASE_URL + "/payments/capture-payment",
    VERIFY_PAYMENT_API: BASE_URL + "/payments/verify-signature",
    SEND_CONFIRMATION_EMAIL_API: BASE_URL + "/payments/send-confirmation-email",
    DEMO_COURSE_REGISTRATION_API: BASE_URL + "/payments/demo-course-registration",
}

export const ViewCourseApi = {
    GET_COURSE_DETAILS_API: BASE_URL + "/course/view-course/:courseId",
    CREATE_RATING_API: BASE_URL + "/course/create-rating",
    LECTURE_COMPLETE_API: BASE_URL + "/course/update-lecture-status"
}

export const RatingsApi = {
    GET_ALL_RATINGS_API: BASE_URL + "/course/get-all-ratings"
}