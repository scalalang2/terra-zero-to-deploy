import { Router } from './types';
import lib from '../lib';

const increment = async (config: any, name: any, options: any) => {
    console.log("handle increment");
}

const router: Router[] = [{
    name: "increment",
    description: "increment the number stored in Blockchain.",
    options: [],
    handler: increment
}]

export default router;