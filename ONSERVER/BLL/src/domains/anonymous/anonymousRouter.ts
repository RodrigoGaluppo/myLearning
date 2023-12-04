import { Router } from "express";
import courseController from "./controllers/courseController";
import chapterController from "./controllers/chapterController";

const anonymousRouter = Router();

anonymousRouter.get("/anonymous/course/list", courseController.list)
anonymousRouter.get("/anonymous/course/:id", courseController.get)


anonymousRouter.get("/anonymous/chapter/list", chapterController.list)
anonymousRouter.get("/anonymous/chapter/:id", chapterController.get)



export default anonymousRouter;