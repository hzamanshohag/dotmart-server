import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../helpers/AppError';
import { IAuthProvider, IUser } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is required');
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This user are already exist');
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(process.env.BCRYPT_SALT_ROUND),
  );

  const authProvider: IAuthProvider = { provider: 'google', providerId: email };

  const result = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return result;
};

const getAllUsers = async (query: { page?: number; limit?: number }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  return {
    meta: {
      page,
      limit,
      skip,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).populate({
    path: 'cart',
    populate: { path: 'product' },
  });

  return user;
};
const getUserByEmail = async (email: string) => {
  const result = await User.findOne({ email });
  return result;
};

const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};

const blockUser = async (id: string) => {
  const user = await User.findById(id);

  if (user?.role === 'ADMIN') {
    throw new AppError(StatusCodes.FORBIDDEN, 'Admin users cannot be blocked');
  }

  if (user?.userStatus === 'INACTIVE') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is already blocked');
  }
  const result = await User.findByIdAndUpdate(
    id,
    { userStatus: 'INACTIVE' },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return result;
};

const unblockUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { userStatus: 'ACTIVE' },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const passwordReset = async (id: string, newPassword: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUND));

  const result = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  getUserByEmail,
  passwordReset,
};
