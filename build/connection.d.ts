import { AsyncFunction, SyncFunction } from 'rvl-pipe';
export declare const connectMongoDB: (mongoUrl: SyncFunction, mongoDb: SyncFunction, options?: SyncFunction | undefined) => AsyncFunction;
export declare const closeMongoDB: () => AsyncFunction;
