import { SyncFunction, AsyncFunction } from 'rvl-pipe';
export declare const runQuery: (collectionName: string, filter: SyncFunction, name: string, options?: SyncFunction | undefined) => AsyncFunction;
export declare const runQueryAggregation: (collectionName: string, pipelineFns: SyncFunction[], name: string, options?: SyncFunction | undefined) => AsyncFunction;
export declare const runQueryCount: (collectionName: string, filter: SyncFunction, name: string) => AsyncFunction;
export declare const runQueryOne: (collectionName: string, filter: SyncFunction, name: string, options?: SyncFunction | undefined) => AsyncFunction;
export declare const runQueryExists: (collectionName: string, filter: SyncFunction, name: string) => AsyncFunction;
