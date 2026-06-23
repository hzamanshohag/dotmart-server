import { HydratedDocument, model, Schema } from 'mongoose';
import { IAuthProvider, IUser, Role } from './user.interface';
import bcrypt from 'bcrypt';

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: false, versionKey: false },
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a valid name'],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value,
          );
        },
        message: 'Please provide a valid email address',
      },
      // immutable: true,
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },

    phoneNumber: {
      type: String,
      required: [true, 'Please provide a valid phone number'],
      validate: {
        validator: function (value: string) {
          return /^[0-9]{10,15}$/.test(value);
        },
        message: 'Phone number must be between 10 and 15 digits',
      },
    },

    photoUrl: {
      type: String,
      validate: {
        validator: function (value: string) {
          return !value || /^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/.test(value);
        },
        message: 'Please provide a valid photo URL',
      },
      default: 'https://i.ibb.co.com/1fyRdSjb/demo-user-logo.png',
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },

    userStatus: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE'],
        message: '{VALUE} is not a valid user status',
      },
      default: 'ACTIVE',
    },
    auths: {
      type: [authProviderSchema],
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
      },
    ],

    // 🔹 Order History Reference
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

// hooks -> pre
// userSchema.pre('save', async function () {
//   const user = this as HydratedDocument<IUser>;

//   if (!user.isModified('password')) return;

//   user.password = await bcrypt.hash(user.password, Number(process.env.BCRYPT_SALT_ROUND));
// });

const User = model<IUser>('User', userSchema);
export default User;
