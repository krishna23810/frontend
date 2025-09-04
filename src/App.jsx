import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
// import {PrivateRoute}
// import "~video-react/styles/scss/video-react";
import Home from "./pages/Home";
import NavBar from './components/comman/NaveBar';
import Signup from "./pages/Singup";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import ResetPass from "./pages/ResetPass";
import About from "./pages/About"
import ContactUS from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/error";
import MyProfile  from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Setting from "./components/core/Dashboard/setting/Setting";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/index"
import {ACCOUNT_TYPE} from "./data/contants";
import MyCourses from "./components/core/Dashboard/MyCourses/index"
import CreateCourse from "./components/core/Dashboard/CreateCourse/index"
// import EditCourse from "./components/core/Dashboard/MyCourses/UpdateCourse/WideForm";
import EditCourse from "./components/core/Dashboard/editcourse/index";
import { useSelector } from "react-redux";
import CartPage from "./pages/catalog/CartPage"
import Course from "./pages/CoursePage/Course";
import ViewCourse from "./pages/ViewCourse";
import VideoDetail from "./components/core/ViewCourse/VideoDetail"
import DeshbordPage from "./components/core/Dashboard/Deshbord/index";

function App() {
  const {user} = useSelector((state) => state.profile);
  // console.log("user in app", user);
  // console.log("account type", user?.accountType);
  return (
    <div className="w-screen min-h-screen bg-gray-700 flex flex-col font-poppins">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password/:id" element={<ResetPass />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUS />} />
        <Route path="catalog/:catalogName" element={<CartPage/>}/>
        <Route path="/course/:Course_Id" element={<Course />} />


        <Route 
        element={<PrivateRoute> <Dashboard /> </PrivateRoute>} >

        <Route path="/dashboard/my-profile" element={<MyProfile />} />
        {/* <Route path="/dashboard/purchase-history" element={<MyProfile />} /> */}
        <Route path="/dashboard/settings" element={<Setting />} />
        {/* <Route path="/dashboard/instructor-dashboard" element={<MyProfile />} /> */}


        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
            <Route path="/dashboard/cart" element={<Cart />} />
            
            </>
          )
        }
        {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path="/dashboard/my-courses" element={<MyCourses />} />
            <Route path="/dashboard/add-course" element={<CreateCourse />} />
            <Route path="/dashboard/my-courses/editCourse/:courseId" element={<EditCourse />} />
            <Route path="/dashboard/instructor" element={<DeshbordPage />} />
            </>
          )
        }

        </Route>


        <Route
        element={<PrivateRoute> <ViewCourse /> </PrivateRoute>}> 

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetail />} />
            </>
          )
        }

        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;