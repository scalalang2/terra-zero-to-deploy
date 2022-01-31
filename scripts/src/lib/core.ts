import {
    LCDClient,
    MsgStoreCode,
    MnemonicKey,
    MsgInstantiateContract,
    Wallet,
} from '@terra-money/terra.js';

import * as fs from 'fs';
import lib from '.';

export const terra = new LCDClient({
    URL: 'https://bombay-fcd.terra.dev',
    chainID: 'bombay-12',
    gasPrices: '0.15uluna',
    gasAdjustment: 1.2,
});

interface LoadWalletParams {
    mnemonic: string;
}

export const loadWallet = (mnemonic:string):Wallet => {
    const key = new MnemonicKey({ mnemonic: mnemonic });
    const wallet = terra.wallet(key);
    return wallet;
}

// Dapp development util functions.
export const deploy = async (params:LoadWalletParams):Promise<void> => {
    try {
        const wallet = loadWallet(params.mnemonic);

        // Create Contract code
        const storeCode = new MsgStoreCode(
            wallet.key.accAddress,
            fs.readFileSync('../artifacts/terra_zero_to_deploy-aarch64.wasm').toString('base64'),
        );

        const storeCodeTx = await wallet.createAndSignTx({
            msgs: [storeCode],
        });

        const storeCodeTxResult = await terra.tx.broadcast(storeCodeTx);
        const codeId = storeCodeTxResult.logs[0].events[1].attributes[1].value;
        console.log('CodeId: ', codeId);

        await new Promise((reoslve, reject) => {
            console.log("waiting to be stable.")
            setTimeout(() => {
                reoslve({})
            }, 2000)
        })

        let initMsg = {
            count: 120
        };

        const instantiate = new MsgInstantiateContract(
            wallet.key.accAddress, // owner
            undefined, // admin address
            34436, // code ID
            { ...initMsg }, // InitMsg
            {}, // init coins
        );

        const instantiateTx = await wallet.createAndSignTx({
            msgs: [instantiate],
        });

        const instantiateTxResult = await terra.tx.broadcast(instantiateTx);
        const contractAddress = instantiateTxResult.logs[0].events[0].attributes[2].value;
        console.log('Contract address: ', contractAddress);
    } catch(e) {
        console.error("error occured during deployment.")
        console.error(e);
    }
};

// Query functions.
interface QueryParams {
    contract: string;
    msg: object;
};

export const query = async ({ contract, msg }:QueryParams):Promise<void> => {
    let addr = lib.config.contractAddrBy(contract)!;
    return await terra.wasm.contractQuery( addr, msg );
};

// Contract Execution functions..
export const exec:(config:any, msg:any) => Promise<any> = async (config, msg) => {

};

// Load configuration.
export const getConfig:any = () => {

}