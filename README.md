# Terra Zero To Deploy
테라 블록체인에서 스마트 컨트랙트 작성하기 - 시작부터 배포까지

## 환경 설정
윈도우 환경에서는 잘 동작하지 않기 때문에 윈도우에서는 WSL을 이용하도록 한다.

#### Rust 설치하기
```
$ rustup default stable // rust 버전을 최신 안정화된 버전으로 돌린다.
$ rustup target add wasm32-unknown-unknown // wasm을 설치한다.
```

템플릿 폴더에서 프로젝트를 구성하기 위해 `cargo-generate` 패키지를 설치한다.
```
$ cargo intall cargo-generate --features vendored-openssl
```

마지막으로 스마트 컨트랙트 파일 압축을 위해 아래 cargo-run-script 패키지를 설치한다. 이 패키지가 실제로 프로젝트를 압축하는데 쓰이는 건 아니고 `Cargo.toml`에 `[package.metadata.scripts]`에 정의된 압축 스크립트를 실행하는데 사용된다.
```
$ cargo install cargo-run-script
```

#### 빌드하기
아래 명령어로 현재 작성한 스마트 컨트랙트를 빌드할 수 있다. 본 레포지토리에는 기본적으로 샘플 코드가 구성되어 있으므로 `git clone` 명령어로 레포지토리를 내려받은 다음 바로 빌드를 실행할 수 있다.
```
$ cargo wasm
```

빌드를 마쳤으면 아래 디렉토리에서 `terra_zero_to_deploy.wasm` 파일이 존재하는 것을 확인한다.
```
$ cd ./target/wasm32-unknown-unknown/release && ls -alh
-rw-r--r-- 2 ubuntu ubuntu 1.7M Jan 17 10:37 terra_zero_to_deploy.wasm
```

여기서 파일의 용량을 보면 `1.7M`인 것을 볼 수 있다. 실제로 이 파일을 그대로 블록체인에 올리려면 용량 문제가 발생하기 때문에 다음 명령어로 빌드 파일을 압축해야 한다. 
> optimize 명령어는 안정적인 실행을 보장하기 위해 실제로는 도커 위에서 실행된다. 따라서, 도커의 최신 버전을 받은 다음 실행해야 한다.
```
$ cargo run-script optimize
```

맥이 M1 칩을 발표하면서 정말 많은 것이 바뀌었고 기존 오픈 소스들이 아직은 미지원인 상태가 많다. 만약 M1에서 환경을 구축했다면 아래 명령어로 압축해야 한다.
```
$ cargo run-script optimize-arm64
```