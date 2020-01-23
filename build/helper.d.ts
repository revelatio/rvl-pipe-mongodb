import { Context } from 'rvl-pipe';
export declare const merge: (key: string, ctx: Context) => (value: any) => Context & {
    [x: string]: any;
};
