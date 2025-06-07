import express from 'express'
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from '../controllers/blogController.mjs';
import upload from '../middleware/multer.mjs';
import auth from '../middleware/auth.mjs';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/delete', auth, deleteBlogById);

blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate',auth, generateContent);

export default blogRouter;