import { Router } from './types';
import lib from '../lib';

const getCount = async (config: any, name: any, options: any) => {
    return await lib.core.query({
        contract: 'counter',
        msg: { get_count: {} }
    });
}

const router: Router[] = [{
    name: "get_count",
    description: "fetch count number.",
    options: [],
    handler: getCount
}]

export default router;