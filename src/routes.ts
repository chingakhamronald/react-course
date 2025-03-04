import express from "express";
import { getUserById, getUsers } from "./user/usersControllers";
// import {
//   createPost,
//   deletePost,
//   getFeed,
//   getPost,
//   updatePost,
//   updatePublish,
// } from "./controllers/postController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id/drafts", getUserById);

//Post Routes
// router.post("/post", createPost);
// router.put("/post/:id/views", updatePost);
// router.put("/publish/:id", updatePublish);
// router.delete("/post/:id", deletePost);
// router.get("/post/:id", getPost);
// router.get("/feed", getFeed);

export default router;
