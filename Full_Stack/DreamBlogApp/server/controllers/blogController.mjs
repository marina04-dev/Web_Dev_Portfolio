import fs from 'fs'
import imagekit from '../configs/imageKit.mjs';
import Blog from '../models/Blog.mjs'
import Comment from '../models/Comment.mjs';
import main from '../configs/gemini.mjs';

export const addBlog = async (req, res) => {
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Check If All Fields Are Present
        if (!title || !description || !category || !imageFile) {
            return res.json({success: false, message: 'Missing Required Fields'});
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        });

        // Optimization through ImageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, // auto image compression
                {format: 'webp'}, // modern format convert
                {width: '1280'} // width resize
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({title, subTitle, description, image, isPublished});

        res.json({success: true, message: 'Blog Added Successfully!'});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({success: true, blogs});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.json({success: false, message: "Blog Not Found!"});
        }
        res.json({success: true, blog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // Delete all comments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: 'Blog Deleted Successfully!'});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog's Status Updated Successfully!"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: 'Comment Added For Review Successfully!'});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const getBlogComments = async (req, res) => {
    try {
        const {blogId} = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const generateContent = async (req, res) => {
    try {
        const {prompt} = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
        res.json({success: true, content});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}