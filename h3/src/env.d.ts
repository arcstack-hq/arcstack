import { IUser } from './models/interfaces'

declare module 'resora' {
  interface Config {
    stubs: {
      controller: string;
      api: string;
      model: string;
      apiResource: string;
    };
  }
}

declare global {
  namespace Express {
    // interface User extends IUser { }

    interface Request {
      user?: User | undefined;
      authToken?: string | undefined;
    }
  }
}

export { }