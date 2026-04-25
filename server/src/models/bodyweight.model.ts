import mongoose, { Schema } from "mongoose";
import { IBodyweightLog } from "../types/bodyweight.types.js";

const bodyweightSchema = new Schema<IBodyweightLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "lbs"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

const Bodyweight = mongoose.model<IBodyweightLog>(
  "Bodyweight",
  bodyweightSchema,
);

export default Bodyweight;
