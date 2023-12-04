import {
    BrowserRouter,
    Routes,
   Route
} from "react-router-dom";

import Login from "../pages/Login";
import Panel from "../pages/Panel";
import PanelCourse from "../pages/PanelCourse";
import PanelLesson from "../pages/PanelLesson";
import { useAuth } from "../hooks/AuthContext";
import PrivateRoute from "./PrivateRoute";
import PanelSubject from "../pages/PanelSubject";
import PanelSUbjects from "../pages/PanelSubjects";
import PanelChapter from "../pages/PanelChapter";
import PanelCustomers from "../pages/PanelCustomers";
import PanelCustomer from "../pages/PanelCustomer";
import PanelEmployees from "../pages/PanelEmployees";
import PanelEmployee from "../pages/PanelEmployee";



const Router:React.FC = ()=>{
    const {user} = useAuth()
    
    return (
        <BrowserRouter>
            

            <Routes>
              
                <Route element={<Login/>} path="/" />
                
                <Route element={ <PrivateRoute component={PanelSUbjects}></PrivateRoute>} path="/Subjects" ></Route>
                <Route element={ <PrivateRoute component={PanelCourse}></PrivateRoute>} path="/Course/:id" ></Route>
                <Route element={ <PrivateRoute component={PanelSubject}></PrivateRoute>} path="/Subject/:id" ></Route>
                <Route element={ <PrivateRoute component={PanelChapter}></PrivateRoute>} path="/Chapter/:id" ></Route>
                <Route element={ <PrivateRoute component={PanelLesson}></PrivateRoute>} path="/Lesson/:id" ></Route>
                <Route element={ <PrivateRoute component={PanelCustomers}></PrivateRoute>} path="/customers" ></Route>
                <Route element={ <PrivateRoute component={PanelCustomer}></PrivateRoute>} path="/customer/:id" ></Route>
                <Route element={ <PrivateRoute component={PanelEmployee}></PrivateRoute>} path="/employee/:id" ></Route>

                <Route element={ <PrivateRoute component={PanelEmployees}></PrivateRoute>} path="/Employees" ></Route>

                <Route element={ <PrivateRoute component={Panel}></PrivateRoute>} path="/panel" ></Route>

                <Route element={
                    <PrivateRoute component={PanelCourse}  ></PrivateRoute>
                } path="/panel/curse/:id" ></Route> // page to edit course info
                
            

            </Routes>
        
        </BrowserRouter>
    )

}



export default Router