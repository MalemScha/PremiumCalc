import mongoose, {Schema} from "mongoose";

const maleFactorSchema = new Schema(
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

export const MaleFactor = mongoose.model("MaleFactor",maleFactorSchema)