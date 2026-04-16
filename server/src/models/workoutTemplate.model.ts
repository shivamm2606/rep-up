import mongoose, { Schema } from "mongoose";
import { IWorkoutTemplate } from "../types/workout.types.js";

const workoutSchema = new Schema<IWorkoutTemplate>(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercises: [
      {
        exerciseId: {
          type: Schema.Types.ObjectId,
          ref: "Exercise",
          required: true,
        },
        targetSets: Number,
        notes: String,
      },
    ],
  },
  { timestamps: true },
);

const WorkoutTemplate = mongoose.model<IWorkoutTemplate>(
  "WorkoutTemplate",
  workoutSchema,
);

export default WorkoutTemplate;
