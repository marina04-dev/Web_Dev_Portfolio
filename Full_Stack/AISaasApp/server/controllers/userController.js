import sql from "../configs/db.js";

// function to handle getUserCreations request
export const getUserCreations = async (req, res) => {
  try {
    // get the userId
    const { userId } = await req.auth();

    // sql query to extract all user's creations from db
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle getPublishedCreations request
export const getPublishedCreations = async (req, res) => {
  try {
    // sql query to extract all published creations from db
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// function to handle toggleLikeCreation request
export const toggleLikeCreation = async (req, res) => {
  try {
    // get the userId and also the creationId
    const { userId } = await req.auth();
    // get the creationId
    const { id } = req.body;

    // validation for id
    if (!id) {
      return res.json({ success: false, message: "Creation ID Is Required!" });
    }

    // sql query to get the creation from creationId
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    // case we do not find any creation with that id
    if (!creation) {
      return res.json({ success: false, message: "Creation Not Found!" });
    }

    // get the creation's number of likes
    const currentLikes = creation.likes;

    // ensure currentLikes is always an array
    if (typeof currentLikes === "string") {
      currentLikes = currentLikes
        ? currentLikes.split(",").filter(Boolean)
        : [];
    } else if (!Array.isArray(currentLikes)) {
      currentLikes = [];
    }

    // convert userId to string format
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    // check if user has already liked that creation so that it means now the user unlikes it
    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked Successfully!";
    } else {
      // else like the creation (include userId to creation's likes array)
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked Successfully!";
    }

    // format the likes array
    const formattedArray = `{${updatedLikes.join(",")}}`;

    // sql query to update the db with the new info
    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
