import mongoose,{Schema} from "mongoose";

const recipeSchema= new Schema({
    ingredient:[{
        type: String
    }],
    content:{
        type: String,
        required: true
    },
    cookingTime:{
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    visibility:{
        type: Boolean,
        default: true
    },
    image:{
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ["VEG","NONVEG","EGG"],
        default: "VEG"
    },

},{timestamps: true})

export const Recipe= mongoose.model("Recipe",recipeSchema);