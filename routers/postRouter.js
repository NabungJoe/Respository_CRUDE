
import express from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/postController.js';
import requireUser from '../middlewares/requireUser.js';


const router = express.Router();

router.get('/', getPosts);
router.post('/', requireUser, createPost);
router.put('/:id', requireUser, updatePost);
router.delete('/:id', requireUser, deletePost);

export default router;
