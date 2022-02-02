import { ICoreModule } from '../lib/core';
export interface Router {
    name: string;
    description?: string;
    options: Option[];
    handler: (config:any, coreModule: ICoreModule, ...args: any[]) => any | Promise<any>;
};

export interface Option {
    name: string;
    description: string;
};