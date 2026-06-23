import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';

const userRouter = Router();

// localhost:5000/api/v1/user/userId

userRouter.post('/create-user', userController.createUser);
userRouter.get('/users', auth(USER_ROLES.ADMIN, USER_ROLES.USER), userController.getAllUsers);
userRouter.get(
  '/users/:email',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  userController.getUserByEmail,
);
userRouter.get(
  '/user/:userId',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  userController.getSingleUser,
);

userRouter.put('/user/:userId', auth(USER_ROLES.ADMIN, USER_ROLES.USER), userController.updateUser);
userRouter.put('/user/block/:userId', auth(USER_ROLES.ADMIN), userController.blockUser);
userRouter.put('/user/unblock/:userId', auth(USER_ROLES.ADMIN), userController.unblockUser);
userRouter.delete('/user/:userId', auth(USER_ROLES.ADMIN), userController.deleteUser);
userRouter.put('/user/password-reset/:userId', userController.passwordReset);

export default userRouter;
