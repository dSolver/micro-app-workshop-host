# Module Federation Package scaffolded by fm-tool

Author: @dSolver

## Recordkeeping

Project ID: 215d67b4-8cb6-4b74-8c3e-0f61f198d6fb
Package ID: 80165485-209d-48f5-9e25-7e818c8c1af7

## Running Locally

After installing with `npm install`, use `npm run start`. This will start the webpack server locally.

The build scripts makes assumptions about the various pre-prod stages (local, beta, gamma), you'll have to update it for what your project actually uses.

Since the federation configs are based on the values on the federation-manager, it may be different for your locally hosted. For example, the local domain might be "localhost", but if you want to share for example over your ip address `1.2.3.4`, you will have to use a `.env` file.

The `.env` file is a set of key-value pairs which affects environment variables (temporarily).

You can use this to set for example:

```
DEV_PORT=3456
DEV_HOST=1.2.3.4
```

