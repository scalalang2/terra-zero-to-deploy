import commander from 'commander';
import lib from './lib';

import query_router from './query/router';
import exec_router from './exec/router';

const program = new commander.Command();

const deployCmd = program.command('deploy')
    .action(() => {
        lib.core.deploy();
    });

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
    cmd.action(el.action);
})

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
    cmd.action(el.action);
})

program.parse(process.argv);
if (!process.argv.length) program.outputHelpInformation();