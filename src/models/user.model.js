import mongoose, {Schema} from mongoose;

const userSchema= new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
    dob:{
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true});

export const User= mongoose.models("User", userSchema);