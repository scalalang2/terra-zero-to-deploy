# Terra Zero To Deploy
테라 블록체인에서 스마트 컨트랙트 작성하기 - 시작부터 배포까지

## 환경 설정
윈도우 환경에서는 잘 동작하지 않기 때문에 윈도우에서는 WSL을 이용하도록 한다.

#### Rust 설치하기
```sh
$ rustup default stable // rust 버전을 최신 안정화된 버전으로 돌린다.
$ rustup target add wasm32-unknown-unknown // wasm을 설치한다.
```

템플릿 폴더에서 프로젝트를 구성하기 위해 `cargo-generate` 패키지를 설치한다.
```sh
$ cargo intall cargo-generate --features vendored-openssl
```

마지막으로 스마트 컨트랙트 파일 압축을 위해 아래 cargo-run-script 패키지를 설치한다. 이 패키지가 실제로 프로젝트를 압축하는데 쓰이는 건 아니고 `Cargo.toml`에 `[package.metadata.scripts]`에 정의된 압축 스크립트를 실행하는데 사용된다.
```sh
$ cargo install cargo-run-script
```

## 빌드하기
아래 명령어로 현재 작성한 스마트 컨트랙트를 빌드할 수 있다. 본 레포지토리에는 기본적으로 샘플 코드가 구성되어 있으므로 `git clone` 명령어로 레포지토리를 내려받은 다음 바로 빌드를 실행할 수 있다.
```sh
$ cargo wasm
```

빌드를 마쳤으면 아래 디렉토리에서 `terra_zero_to_deploy.wasm` 파일이 존재하는 것을 확인한다.
```sh
$ cd ./target/wasm32-unknown-unknown/release && ls -alh
-rw-r--r-- 2 ubuntu ubuntu 1.7M Jan 17 10:37 terra_zero_to_deploy.wasm
```

여기서 파일의 용량을 보면 `1.7M`인 것을 볼 수 있다. 실제로 이 파일을 그대로 블록체인에 올리려면 용량 문제가 발생하기 때문에 다음 명령어로 빌드 파일을 압축해야 한다. 
> optimize 명령어는 안정적인 실행을 보장하기 위해 실제로는 도커 위에서 실행된다. 따라서, 도커의 최신 버전을 받은 다음 실행해야 한다.
```sh
$ cargo run-script optimize
```

맥이 M1 칩을 발표하면서 정말 많은 것이 바뀌었고 기존 오픈 소스들이 아직은 미지원인 상태가 많다. 만약 M1에서 환경을 구축했다면 아래 명령어로 압축해야 한다.
```sh
$ cargo run-script optimize-arm64
```

압축까지 모두 마쳤으면 이제는 `artifacts` 폴더안에 스마트 컨트랙트 바이너리가 생성된다.
```sh
$ ls -alh ./artifacts
buntu ubuntu 127K Jan 17 10:44 terra_zero_to_deploy.wasm
```
용량이 1.7M 에서 127K로 거의 10배 이상 용량이 작아진 것을 볼 수 있다.

## 컨트랙트 배포하기
빌드까지 완료했다면 이제 테라 블록체인으로 실제로 배포해보자. 본 예제에서 사용된 네트워크는 `bombay` 테스트넷을 이용했기 때문에 실제 테라로 배포하려면 메인넷 URL을 작성해야 한다. `scripts/src/index.ts` 파일에서 LCDClient 객체를 생성할 때 정보를 메인넷으로 교체해주면된다.

만약, 테스트넷에서 현재 루나가 없다면 [이 링크](https://faucet.terra.money/)에서 테스트넷 루나를 받도록 하자.
```typescript
const terra = new LCDClient({
    URL: 'https://bombay-fcd.terra.dev',
    chainID: 'bombay-12',
    gasPrices: '0.15uluna',
    gasAdjustment: 1.2,
});
```

그리고 지갑을 생성할 때 본인 계정으로 생성하도록 한다.
```typescript
const mk = new MnemonicKey({
    // This is a my test mnemonic. NO NOT USE THIS FOR REAL MOENY
    mnemonic: 'velvet borrow tone ice outer sock humor vault coast drastic number cannon flower grass arrange shoulder victory cover thought exercise type camp submit fit',
});

const wallet = terra.wallet(mk);
```

실제 배포를 하려면 아래 명령어를 수행해주면 된다.
```sh
$ cd ./scripts && yarn install
$ yarn start
Contract address terra1uj7t0r0ny7jlu0c453d33darjsj9grlxsrl3n6
Done in 21.25s
```
