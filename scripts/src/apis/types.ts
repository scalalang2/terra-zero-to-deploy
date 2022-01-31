export interface Router {
    name: string;
    description?: string;
    options: Option[];
    handler: (...args: any[]) => void | Promise<void>;
};

export interface Option {
    name: string;
    description: string;
};