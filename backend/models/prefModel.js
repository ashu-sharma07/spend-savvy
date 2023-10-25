import mongoose from "mongoose";

const prefSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
    },
    transporting: {
      type: String,
    },
    age: {
      type: Number,
    },
    smoking: {
      type: String,
    },
    studyYear: {
      type: Number,
    },
    drinks: {
      type: String,
    },
    living: {
      type: String,
    },
    hobbies: {
      type: String,
    },
    scholarship: {
      type: String,
    },
    cosmetics: {
      type: String,
    },
    jobs: {
      type: String,
    },
    sub: {
      type: String,
    },
  },
  { timestamps: true }
);

export default prefSchema;
