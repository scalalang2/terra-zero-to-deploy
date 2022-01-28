import commander from 'commander';
import lib from './lib';
import yaml from 'js-yaml';

import query_router from './query/router';
import exec_router from './exec/router';
import path from 'path';
import fs from 'fs';

function build_query_commands(config: any) {
    let queries = new commander.Command('query')
        .action(() => {
            queries.outputHelp();
        });

    query_router.forEach(el => {
        let subcli = queries.command(el.name);

        if (el.description) subcli.description(el.description);
        for (let opt of el.options) {
            subcli.option(opt.name, opt.description);
        }
        // cmd = cmd.action((...args) => el.action(config, ...args));
        subcli.action(el.action)
    })
    return queries
}

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
program.addCommand(build_query_commands(config));

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
        cmd.option(opt.name, opt.description);
    }
    cmd.action((...args) => el.action(config, ...args));
})

program.parse(process.argv);
if (!process.argv.length) program.outputHelp();