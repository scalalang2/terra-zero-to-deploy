import { Router } from './types';
import { ICoreModule } from '../lib/core';

const increment = async (config: any, core: ICoreModule, name: any, options: any) => {
    return core.action({
        contract: 'counter',
        wallet: 'tester',
        msg: {
            increment: {}
        }
    })
}

const router: Router[] = [{
    name: "increment",
    description: "increment the number stored in Blockchain.",
    options: [],
    handler: increment
}]

export default router;