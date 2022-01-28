import commander from 'commander';
import lib from './lib';
import yaml from 'js-yaml';

import query_router from './query/router';
import exec_router from './exec/router';
import path from 'path';
import fs from 'fs';

// Load a configuration.
let filename = path.join(__dirname, '../config.yml');
let contents = fs.readFileSync(filename, 'utf8');
let config:any = yaml.load(contents);

// Define a program.
const program = new commander.Command();

// debug command
const debug = program.command('debug')
    .description('this is only for debugging.')
    .action(() => {
        console.info("loaded configuration:")
        console.info(config);
    })

// deployment command
const deployCmd = program.command('deploy')
    .action(() => {
        lib.core.deploy(config.wallet.mnemonic);
    });

// query command
const queryCmd = program.command('query')
    .description("Send query message to the Terra blockchain.")
    .action(() => {
        queryCmd.outputHelp();
    });

query_router.forEach(el => {
    let cmd = queryCmd.command(el.name);

    if(el.description) cmd.description(el.description);
    for(let opt of el.options) {
        cmd.options(opt.name, opt.description);
    }
    cmd.action((...args) => el.action(config, ...args));
})

// execute transction command
const execCmd = program.command('exec')
    .description("Execute a method on smart contract from the Terra blockchain.")
    .action(() => {
        execCmd.outputHelp();
    });

exec_router.forEach(el => {
    let cmd = execCmd.command(el.name);

    if(el.description) cmd.description(el.description);
    for(let opt of el.options) {
        cmd.options(opt.name, opt.description);
    }
    cmd.action((...args) => el.action(config, ...args));
})

program.parse(process.argv);
if (!process.argv.length) program.outputHelpInformation();