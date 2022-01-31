export interface Router {
    name: string;
    description?: string;
    options: Option[];
    handler: (...args: any[]) => any | Promise<any>;
};

export interface Option {
    name: string;
    description: string;
};