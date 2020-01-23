import { SyncFunction, AsyncFunction } from 'rvl-pipe';
export declare const createDocument: (collectionName: string, document: SyncFunction, name: string) => AsyncFunction;
export declare const upsertDocument: (collectionName: string, filter: SyncFunction, dataCreator: SyncFunction, name: string) => AsyncFunction;
export declare const updateDocumentOne: (collectionName: string, filterCreator: SyncFunction, dataCreator: SyncFunction) => AsyncFunction;
