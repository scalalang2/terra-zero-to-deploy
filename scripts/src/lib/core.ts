import {
    LCDClient,
    MsgStoreCode,
    MnemonicKey,
    MsgInstantiateContract,
} from '@terra-money/terra.js';

import * as fs from 'fs';

export const deploy:() => Promise<void> = async () => {
    try {
        const mk = new MnemonicKey({
            mnemonic: 'velvet borrow tone ice outer sock humor vault coast drastic number cannon flower grass arrange shoulder victory cover thought exercise type camp submit fit',
        });

        // connect to bombay network
        const terra = new LCDClient({
            URL: 'https://bombay-fcd.terra.dev',
            chainID: 'bombay-12',
            gasPrices: '0.15uluna',
            gasAdjustment: 1.2,
        });

        const wallet = terra.wallet(mk);

        // Create Contract code
        const storeCode = new MsgStoreCode(
            wallet.key.accAddress,
            fs.readFileSync('../artifacts/terra_zero_to_deploy.wasm').toString('base64'),
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
            }, 5000)
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
}