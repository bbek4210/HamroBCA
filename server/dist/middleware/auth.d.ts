import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    admin?: {
        _id: string;
        email: string;
    };
}
export declare const authenticateAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateToken: (adminId: string) => string;
export {};
//# sourceMappingURL=auth.d.ts.map