import { clerkClient } from "@clerk/express";

// middleware to chech userId and hasPremiumPlan
export const auth = async (req, res, next) => {
  try {
    // get the userId and has property from req.auth() middleware that has been attached to the request by clerk middlewares
    const { userId, has } = await req.auth();

    // check if userId exists
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized Access!" });
    }

    // check if user has premium plan
    const hasPremiumPlan = await has({ plan: "Premium" });
    const user = await clerkClient.users.getUser(userId);

    // handle free usage tracking properly
    if (!hasPremiumPlan) {
      // check if free_usage exists in privateMetadata
      if (
        user.privateMetadata &&
        typeof user.privateMetadata.free_usage === "number"
      ) {
        req.free_usage = user.privateMetadata.free_usage;
      } else {
        // initialize free_usage if it doesn't exist
        await clerkClient.users.updateUser(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            free_usage: 0,
          },
        });
        req.free_usage = 0;
      }
    } else {
      req.free_usage = 0; // premium users don't have usage limits
    }

    req.plan = hasPremiumPlan ? "Premium" : "Free";
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
