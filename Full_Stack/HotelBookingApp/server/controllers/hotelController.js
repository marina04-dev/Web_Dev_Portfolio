import Hotel from '../models/hotel.js'
import User from "../models/user.js"

export const registerHotel = async (req, res) => {
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id;

        // Check if User has already registered
        const hotel = await Hotel.findOne({owner});
        if (hotel) {
            return res.json({success: false, message: "Hotel Has Already Been Registered!"});
        }

        await Hotel.create({name, address, contact, city, owner});
        await User.findByIdAndUpdate(owner, {role: "hotelOwner"});
        res.json({success: true, message: "Hotel Registered Successfully!"});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
