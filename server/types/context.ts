import { Request } from 'express';
import { IUser } from './index';

export interface Context {
	req: Request;
	user?: IUser;
}
