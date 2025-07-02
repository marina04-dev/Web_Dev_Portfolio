import express from 'express';
import { bookAppointment, cancelAppointment, getProfile, listAppointments, loginUser, paymentRazorpay, registerUser, updateProfile, verifyRazorpay } from '../controllers/userController.mjs';
import authUser from '../middlewares/authUser.mjs';
import upload from '../middlewares/multer.mjs';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointments);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-razorpay', authUser, paymentRazorpay);
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

export default userRouter;