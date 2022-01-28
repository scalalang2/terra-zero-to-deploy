import { getCount } from './actions';

interface QueryRouter {
    name: string;
    description?: string;
    options: QueryOption[];
    action: (...args: any[]) => void | Promise<void>;
};

interface QueryOption {
    name: string;
    description: string;
};

const router:QueryRouter[] = [{
    name: "get_count",
    description: "fetch count number.",
    options: [{
        name: "-c --contract",
        description: "The name of contract you wanna query."
    }],
    action: getCount
}]

export default router;