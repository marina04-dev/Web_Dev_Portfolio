import { Webhook } from "svix";
import User from "../models/User.js";

// API controller function to manage clerk user with database
export const clerkWebHooks = async (req, res) => {
  try {
    // create a svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // verifying req headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // get user data from req.body
    const { data, type } = req.body;
    // data: contains the payload, type: contains method POST,PUT,GET,DELETE,PATCH

    // run commands for each case
    switch (type) {
      case "user.created": {
        // create user with the provided data
        const userData = {
          _id: data.id,
          name: data.first_name + " " + data.last_name,
          email: data.emailaddresses[0].email_address,
          image: data.image_url,
          resume: "",
        };
        // save the user in the database
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        // update user with the provided data
        const userData = {
          name: data.first_name + " " + data.last_name,
          email: data.emailaddresses[0].email_address,
          image: data.image_url,
        };
        // save the user in the database
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        // delete the user with the specific id
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
