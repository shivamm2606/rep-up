import mongoose, { Schema } from "mongoose";
import { IExercise } from "../types/workout.types.js";

const exerciseSchema = new Schema<IExercise>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility"],
      required: true,
    },
    muscleGroup: {
      type: String,
      enum: [
        "chest",
        "back",
        "legs",
        "shoulders",
        "arms",
        "core",
        "full_body",
        "upper_body",
        "lower_body",
      ],
      required: true,
    },
    isCustom: {
      type: Boolean,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

exerciseSchema.index({ isCustom: 1, createdBy: 1 });

const Exercise = mongoose.model<IExercise>("Exercise", exerciseSchema);

export default Exercise;
