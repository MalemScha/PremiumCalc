import mongoose, {Schema} from "mongoose";

const transFactorSchema = new Schema(
    {
        age: {
            type: Number,
            required: true,
        },
        factor:
        {
            type: Number,
            required: true,
        }
    }
)

export const TransFactor = mongoose.model("TransFactor",transFactorSchema)