import { Increment } from './actions';

interface ExecRouter {
    name: string;
    description?: string;
    options: ExecOption[];
    action: (...args: any[]) => void | Promise<void>;
};

interface ExecOption {
    name: string;
    description: string;
};

const router:ExecRouter[] = [{
    name: "increment",
    description: "Incremenet one to stored value.",
    options: [],
    action: Increment
}]

export default router;