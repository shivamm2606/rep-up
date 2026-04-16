import mongoose, { Schema } from "mongoose";
import { IExerciseLog, IWorkoutSession } from "../types/workout.types.js";

const setLogSchema = Schema.Types.Mixed;

const exerciseLogSchema = new Schema<IExerciseLog>({
  sets: [setLogSchema],
  notes: String,
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
});

const workoutSessionSchema = new Schema<IWorkoutSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, default: Date.now },

    exercises: [exerciseLogSchema],

    duration: Number,

    notes: String,

    templateUsed: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutTemplate",
    },
  },
  { timestamps: true },
);

const WorkoutSession = mongoose.model<IWorkoutSession>(
  "WorkoutSession",
  workoutSessionSchema,
);

export default WorkoutSession;
