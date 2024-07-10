import mongoose, {Schema} from "mongoose";

const premiumSchema = new Schema(
    {
        age: {
            type: Number,
            required: true,
        },
        term:
        {
            type: Number,
            required: true,
        },
        price:
        {
            type: Number,
            required: true,
        },
    }
)

export const Premium = mongoose.model("Premium",premiumSchema)