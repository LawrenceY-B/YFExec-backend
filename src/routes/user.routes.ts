import { Router } from 'express';
import { addMember } from '../contollers/users/users';

const UserRoutes=Router();

UserRoutes.post('/add',addMember)


export default UserRoutes;




