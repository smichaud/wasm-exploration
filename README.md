# Wasm Using Rust - Exploration

Based on [this
tutorial](https://rustwasm.github.io/book/introduction.html)

## Setup from this repository

``` bash
wasm-pack build
cd www 
npm install
npm run start
```

## First setup (this has been done, no need to do it):

- Install Cargo, rustc, rustup…
- Install wasm-pack (‘yay -S wasm-pack’)
- Create the project:

``` bash
rustup default nightly && rustup update
cargo install cargo-generate
cargo generate --git https://github.com/rustwasm/wasm-pack-template
# Set a name (e.g. A_NAME)
cd A_NAME
wasm-pack build
npm init wasp-app www
cd www
npm install
```

To use the local package, edit package.json

``` json
{
  // ...
  "dependencies": {
    "A_NAME": "file:../pkg",
    // ...
  }
}
```

Run using: `npm run start`
