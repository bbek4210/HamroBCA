import mongoose, { Document } from 'mongoose';
export declare enum NoticeType {
    GENERAL = "general",
    EXAM = "exam",
    ASSIGNMENT = "assignment",
    EVENT = "event",
    URGENT = "urgent"
}
export interface INotice extends Document {
    title: string;
    content: string;
    type: NoticeType;
    targetSemesters: number[];
    isUrgent: boolean;
    isPublished: boolean;
    publishDate?: Date;
    expiryDate?: Date;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Notice: mongoose.Model<INotice, {}, {}, {}, mongoose.Document<unknown, {}, INotice, {}, {}> & INotice & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Notice.d.ts.map