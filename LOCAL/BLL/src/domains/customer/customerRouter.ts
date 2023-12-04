import { Router } from "express";
import customerController from "./controllers/customerController";
import customerAuth from "../../middlewares/customerAuth";
import customerCourseController from "./controllers/customerCourseController";
import chapterController from "./controllers/chapterController";
import lessonController from "./controllers/lessonController";
import uploadImg from "../../middlewares/uploadImg"
import certificateController from "./controllers/certificateController";
import courseController from "./controllers/courseController";
import questionController from "./controllers/questionController";
import commentController from "./controllers/commentController";

const customerRouter = Router();

customerRouter.put("/customer/confirm/:id",customerController.changeConfirmedStatus)
customerRouter.put("/customer/changepassword/:tokenId",customerController.changePassword)

customerRouter.post("/customer/login",customerController.login)
//customerRouter.post("/customer",customerController.post)
customerRouter.post("/customer/forgotPassword",customerController.sendChangePasswordEmail)
customerRouter.get("/customer/",customerAuth,customerController.get)
customerRouter.put("/customer/",customerAuth,customerController.put)


customerRouter.post("/customer/course/",customerAuth,courseController.post)
customerRouter.delete("/customer/course/:id",customerAuth,courseController.del)
customerRouter.get("/customer/course/list/",customerAuth,courseController.list)
customerRouter.get("/customer/course/:id",customerAuth,courseController.get)
customerRouter.get("/customer/chapter/list/:courseId",customerAuth,chapterController.list)
customerRouter.get("/customer/chapter/:id",customerAuth,chapterController.get)


customerRouter.delete("/customer/lesson/:id",customerAuth,lessonController.del)
customerRouter.post("/customer/lesson/",customerAuth,lessonController.post)
customerRouter.get("/customer/lesson/list/:chapterId",customerAuth,lessonController.list)
customerRouter.get("/customer/lesson/:id",customerAuth,lessonController.get)



customerRouter.post("/customer/certificate/",customerAuth,certificateController.post)
customerRouter.get("/customer/certificate/",customerAuth,certificateController.get)


customerRouter.get("/customer/question/list/",customerAuth,questionController.list)
customerRouter.get("/customer/question/:id",customerAuth,questionController.get)
customerRouter.delete("/customer/question/:id",customerAuth,questionController.del)
customerRouter.post("/customer/question/",customerAuth,questionController.post)


customerRouter.post("/customer/comment/",customerAuth,commentController.post)


export default customerRouter;