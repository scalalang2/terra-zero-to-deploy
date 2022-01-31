import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export const getConfig = ():any => {
    // Load a configuration.
    let filename = path.join(__dirname, '../../config.yml');
    let contents = fs.readFileSync(filename, 'utf8');
    let config: any = yaml.load(contents);
    return config;
}

export function contractAddrBy(name: string): string | null {
    let config = getConfig();
    let contracts = config.contracts;
    for(let el of contracts) {
        if(el.name == name) return el.address;
    }
    return null;
}