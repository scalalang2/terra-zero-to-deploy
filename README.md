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