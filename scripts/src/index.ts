import commander from 'commander';
import lib from './lib';

import query_router from './apis/queries';
import action_router from './apis/actions';

// Load a configuration.
let config = lib.config.getConfig();
let coreModule = new lib.core.CoreModule(config);

function build_query_commands(config: any) {
    let queries = new commander.Command('query')
        .description("Query a data from Terra blockchain.")
        .action(() => {
            queries.outputHelp();
        });

    query_router.forEach(el => {
        let subcli = queries.command(el.name);

        if (el.description) subcli.description(el.description);
        for (let opt of el.options) {
            subcli.option(opt.name, opt.description);
        }
        subcli.action(async (...args) => {
            let ret = await el.handler(config, coreModule, ...args);
            console.info(`--------- query result: ---------`)
            console.info(`query: ${el.name}`)
            console.info();
            console.info(ret);
            console.info(`---------------------------------`)
        });
    })
    return queries
}

function build_action_commands(config: any) {
    // execute transction command
    const actionCmd = program.command('action')
        .description("Execute a method on smart contract from the Terra blockchain.")
        .action(() => {
            actionCmd.outputHelp();
        });

    action_router.forEach(el => {
        let subcli = actionCmd.command(el.name);

        if (el.description) subcli.description(el.description);
        for (let opt of el.options) {
            subcli.option(opt.name, opt.description);
        }

        subcli.action(async (...args) => {
            let ret = await el.handler(config, coreModule, ...args);
            console.info(`--------- action result: ---------`)
            console.info(`action: ${el.name}`)
            console.info();
            console.info(ret);
            console.info(`---------------------------------`)
        });
    })

    return actionCmd
}

// Define a program.
const program = new commander.Command();

// debug command
program.command('debug')
    .description('this is only for debugging.')
    .action(() => {
        console.info("loaded configuration:")
        console.info(config);
    })

// deployment command
program.command('deploy')
    .requiredOption('-w --wallet', 'wallet name in config.yml')
    .requiredOption('-m --wasm', 'wasm file name in config.yml')
    .action((name, options) => {
        coreModule.deploy(options.args[0], options.args[1])
    });

// query command
program.addCommand(build_query_commands(config));
program.addCommand(build_action_commands(config));

program.parse(process.argv);
if (!process.argv.length) program.outputHelp();