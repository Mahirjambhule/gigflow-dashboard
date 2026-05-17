import { Schema, model, Document } from 'mongoose';

// 1. Define an enum for strict role enforcement
export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales User'
}

// 2. Create the TypeScript Interface representing a User document
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

// 3. Create the Mongoose Schema matching the interface
const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    passwordHash: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.SALES 
    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// 4. Export the Model
export const User = model<IUser>('User', userSchema);