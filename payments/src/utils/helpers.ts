import mongoose from 'mongoose';

export const createId = () => new mongoose.Types.ObjectId().toHexString()