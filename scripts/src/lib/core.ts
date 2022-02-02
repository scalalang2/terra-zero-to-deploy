import {
    LCDClient,
    MsgStoreCode,
    MnemonicKey,
    MsgInstantiateContract,
    Wallet,
    BlockTxBroadcastResult,
    Coins,
    CreateTxOptions,
    MsgExecuteContract
} from '@terra-money/terra.js';

import * as fs from 'fs';
import lib from '.';

interface QueryParams {
    contract: string;
    msg: object;
};

interface ActionParams {
    contract: string;
    wallet: string;
    msg: object;
    coins?: Coins.Input,
    options?: CreateTxOptions
}

export interface ICoreModule {
    config: any;
    client: LCDClient;
    buildTerraClient(config:any):LCDClient;
    loadWallet(name: string): Wallet | null;
    deploy(walletName: string, wasmFileName: string):Promise<void>;
    query(params:QueryParams):Promise<any>;
    action(params: ActionParams): Promise<BlockTxBroadcastResult>;
}

export class CoreModule implements ICoreModule {
    config: any;
    client:LCDClient;

    constructor(config:any){
        this.config = config;
        this.client = this.buildTerraClient(config);
    }

    buildTerraClient(config:any):LCDClient {
        return new LCDClient({
            URL: config.terra.url,
            chainID: config.terra.chainID,
            gasPrices: config.terra.gasPrices,
            gasAdjustment: config.terra.gasAdjustment
        })
    }

    loadWallet(name: string):Wallet | null {
        let mnemonic = null;
        for (let el of this.config.wallet) {
            if (el.name === name) {
                mnemonic = el.mnemonic;
                break;
            }
        }

        if(mnemonic === null) return null;
        const key = new MnemonicKey({ mnemonic: mnemonic });
        const wallet = this.client.wallet(key);
        return wallet;
    }

    async deploy(walletName: string, wasmFileName: string):Promise<void> {
        let wallet = this.loadWallet(walletName);
        if(wallet == null) throw new Error(`no wallet exists for '${walletName}'`);

        // Create Contract code
        let wasmFilePath = null;
        let initMsg = null;
        for(let el of this.config.deployment) {
            if(el.name === wasmFileName) {
                wasmFilePath = el.path;
                initMsg = el.initMsg;
                break;
            }
        }

        if (wasmFilePath == null) throw new Error(`no wasm file exists: ${wasmFileName}`);

        const storeCode = new MsgStoreCode(
            wallet.key.accAddress,
            fs.readFileSync(`../artifacts/${wasmFilePath}`).toString('base64'),
        );

        const storeCodeTx = await wallet.createAndSignTx({
            msgs: [storeCode],
        });

        const storeCodeTxResult = await this.client.tx.broadcast(storeCodeTx);
        const codeId = storeCodeTxResult.logs[0].events[1].attributes[1].value;
        console.log('CodeId: ', codeId);

        await new Promise((reoslve, reject) => {
            console.log("waiting to be stable.")
            setTimeout(() => {
                reoslve({})
            }, 2000)
        })

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

        const instantiateTxResult = await this.client.tx.broadcast(instantiateTx);
        const contractAddress = instantiateTxResult.logs[0].events[0].attributes[2].value;
        console.log('Contract address: ', contractAddress);
    }

    async query({ contract, msg }:QueryParams):Promise<any> {
        let addr = lib.config.contractAddrBy(contract)!;
        return await this.client.wasm.contractQuery(addr, msg);
    }

    async action(params:ActionParams):Promise<BlockTxBroadcastResult> {
        let addr = lib.config.contractAddrBy(params.contract)!;
        let config = lib.config.getConfig();
        let wallet = this.loadWallet(params.wallet)!;

        const msgs = [
            new MsgExecuteContract(
                wallet.key.accAddress,
                addr,
                params.msg,
                params.coins
            ),
        ];
        const _options = params.options ? { ...params.options, msgs } : { msgs };
        const tx = await wallet.createAndSignTx(_options);
        return await this.client.tx.broadcast(tx);
    }
}