# React Components for AWS Cognito

## Installation

Run:

```bash
npm install @cpmech/gate
```

Add the following to your `npm_postinstall.bash` script


```bash
if [[ -d "./node_modules/@cpmech/gate/gate" ]]; then
    echo ">>> copy gate to src <<<"
    rm -rf ./src/gate
    cp -rf ./node_modules/@cpmech/gate/gate ./src/
fi
```
