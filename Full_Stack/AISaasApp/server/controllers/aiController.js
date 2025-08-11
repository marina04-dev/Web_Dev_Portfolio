import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// function to handle generateArticle requests
export const generateArticle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // limit for the free usage
    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached! Upgrade To Continue!",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    // get the response's content
    const content = response.choices[0].message.content;

    // insert the new data into the database
    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article)`;

    // add usage to the free users
    if (plan !== "Premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle generateBlogTitle requests
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // limit for the free usage
    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached! Upgrade To Continue!",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    // get the response's content
    const content = response.choices[0].message.content;

    // insert the new data into the database
    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    // add usage to the free users
    if (plan !== "Premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle generateImage requests (only for premium plan users)
export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    // limit for the free usage
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This Feature Is Only Available For Premium Subscriptions!",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    // make the api call to clipdrop.co
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // insert the new data into the database
    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle removeImageBackground requests (only for premium plan users)
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const image = req.file;
    const plan = req.plan;

    // limit for the free usage
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This Feature Is Only Available For Premium Subscriptions!",
      });
    }

    // check if file exists
    if (!image) {
      return res.json({
        success: false,
        message: "No Image File Uploaded!",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    // insert the new data into the database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    // clean up uploaded file
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle removeImageObject requests (only for premium plan users)
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    // limit for the free usage
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This Feature Is Only Available For Premium Subscriptions!",
      });
    }

    // check if file exists
    if (!image) {
      return res.json({
        success: false,
        message: "No Image File Uploaded!",
      });
    }

    // check if object is provided
    if (!object) {
      return res.json({
        success: false,
        message: "Object To Remove Must Be Specified!",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove: ${object}` }],
      resource_type: "image",
    });

    // insert the new data into the database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

    // clean up uploaded file
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle resumeReview requests (only for premium plan users)
export const resumeReview = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const resume = req.file;
    const plan = req.plan;

    // limit for the free usage
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This Feature Is Only Available For Premium Subscriptions!",
      });
    }

    // check if file exists
    if (!resume) {
      return res.json({
        success: false,
        message: "No Resume File Uploaded!",
      });
    }

    // check the file size
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume File Size Exceeds Allowed Size (5MB).",
      });
    }

    // extract the content from the resume file
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    // generate the prompt to review the resume
    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    // gemini ai review resume request
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // get the response's content
    const content = response.choices[0].message.content;

    // insert the new data into the database
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    // clean up uploaded file
    if (fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
