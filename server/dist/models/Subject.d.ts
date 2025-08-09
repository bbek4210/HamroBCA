import mongoose, { Document } from 'mongoose';
export interface ISubject extends Document {
    name: string;
    code: string;
    semester: number;
    creditHours: number;
    lectureHours: number;
    tutorialHours?: number;
    labHours?: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Subject: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Subject.d.ts.map