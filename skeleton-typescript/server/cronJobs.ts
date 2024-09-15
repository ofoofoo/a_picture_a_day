import cron from 'node-cron';
import axios from 'axios';
import dotenv from "dotenv";
import { startOfDay, endOfDay } from 'date-fns';
import ImageModel from './models/Image';
import UserModel from './models/User';
import WinnerModel from './models/Winner';
dotenv.config({});

// change server url to final url
axios.defaults.baseURL = `http://localhost:${process.env.PORT || 3000}`;

function resetDay() {
    cron.schedule('*/1 * * * *', async () => {
        try {
            console.log("Computing yesterday's winner ...");
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const start = startOfDay(yesterday);
            const end = endOfDay(yesterday);

            const images = await ImageModel.find({
                uploadedAt: {
                    $gte: start,
                    $lt: end,
                },
            });

            if (images.length === 0) {
                console.log('No images uploaded yesterday.');
                return;
            }

            const winningImage = images.reduce((prev, current) => {
                return prev.votes > current.votes ? prev : current;
            });
            const winningUser = await UserModel.findById(winningImage.uploadedBy);
            if (!winningUser) {
                console.log('Winner user not found.');
                return;
            }

            const response = await axios.get('/api/prompt');
            const prompt = response.data.prompt;

            const winner = new WinnerModel({
                image: winningImage._id,
                user: winningUser._id,
                date: start,
                prompt,
                votes: winningImage.votes,
            });
            await winner.save();
            console.log(`Winner saved for ${yesterday.toDateString()}`);
        } catch (error) {
            console.error(`Failed to get winner: ${error}`);
        }

        try {
            console.log("Changing prompt for today ...");
            axios.get('/api/update-prompt');
        } catch (error) {
            console.error(`Failed to change prompt: ${error}`);
        }

        try {
            console.log("Resetting users' uploads ...");
            const response = await axios.post('/api/reset-users');
            if (response.status === 200) {
                console.log('Users reset successfully.');
            } else {
                console.error('Failed to reset users.');
            }
        } catch (error) {
            console.error(`Failed to reset users: ${error}`);
        }
    });
}

export default resetDay;
