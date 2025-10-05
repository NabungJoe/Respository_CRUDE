import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "Email must be unique!"],
        minLength: [5, "Email must be at least 5 characters long"],
        lowercase: true,
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select: false,
      },
      
}, {
   timestamps:true
  }

 
)

export default mongoose.model('Admin', adminSchema);