import {
    BrowserRouter,
    createBrowserRouter,
    Routes,
   Route
} from "react-router-dom";

import Course from "../pages/Course";
import DashBoard from "../pages/DashBoard";
import Lesson from "../pages/Lesson";
import Login from "../pages/Login";
import ErrorPage from "../pages/PageError";

import { useAuth } from "../hooks/AuthContext";
import PrivateRouteComponent from "./PrivateRoute";
import Profile from "../pages/Profile";
import Courses from "../pages/Courses";
import CourseInfo from "../pages/CourseInfo";
import Forum from "../pages/Forum";
import Question from "../pages/Question";
import COnfirmEMail from "../pages/confirmEmail";
import ForgotPassword from "../pages/forgotPassword";




const Router:React.FC = ()=>{
    const {user} = useAuth()
    
    return (
        <BrowserRouter>
            

            <Routes>
              
                <Route element={<Login/>} path="/" />
      
                <Route element={<Courses/>} path="/courses" ></Route>
                <Route element={<COnfirmEMail/>} path="/confirmEmail/:customedId" ></Route>
                <Route element={<ForgotPassword/>} path="/changePassword/:tokenId" ></Route>
                <Route element={<CourseInfo/>} path="/courseInfo/:id" ></Route>
                <Route element={ <PrivateRouteComponent component={DashBoard} />} path="/dashboard" />
                <Route element={ <PrivateRouteComponent component={Course} />} path="/course/:id" />
                <Route element={ <PrivateRouteComponent component={Lesson} />} path="/lesson/:id" />
                <Route element={ <PrivateRouteComponent component={Profile} />} path="/profile" />
                <Route element={ <PrivateRouteComponent component={Forum} />} path="/forum/:id" />
                <Route element={ <PrivateRouteComponent component={Question} />} path="/question/:id" />
                
               
            </Routes>
        
        </BrowserRouter>
    )

}
export default Router