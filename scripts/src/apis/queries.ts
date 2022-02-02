import { Router } from './types';
import { ICoreModule } from '../lib/core';

const getCount = async (config: any, core: ICoreModule, name: any, options: any) => {
    return await core.query({
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