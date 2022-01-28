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
    options: [],
    action: getCount
}]

export default router;