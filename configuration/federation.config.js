
// host federation.config.js

const fs = require("fs")
const path = require("path")
const stage = process.env.BUILD_STAGE ?? "beta"

const remoteUrls = {
  "local": {
    "starter": "http://localhost:4001/remoteEntry.js"
  },
  "beta": {
    "starter": "http://localhost:4001/remoteEntry.js"
  },
  "gamma": {
    "starter": "http://localhost:4001/remoteEntry.js"
  },
  "prod": {
    "starter": "http://localhost:4001/remoteEntry.js"
  }
}

federationConfig = {
  name: "host",
  filename: "remoteEntry.js",
  remotes: {
    "starter": `promise new Promise((resolve, reject) => {
            const urlParams = new URLSearchParams(window.location.search)
            const override = urlParams.get('starter')
            // This part depends on how you plan on hosting and versioning your federated modules
            const remoteUrl = override || '${remoteUrls[stage]['starter']}'
            const script = document.createElement('script')
            script.src = remoteUrl
            script.onload = () => {
              // the injected script has loaded and is available on window
              // we can now resolve this Promise
              const proxy = {
                get: (request) => window['starter'].get(request),
                init: (arg) => {
                  try {
                    return window['starter'].init(arg)
                  } catch(e) {
                    console.log('remote container already initialized')
                  }
                }
              }
              resolve(proxy)
            }
            script.onerror = (e) => {
              console.error('error loading starter:', e)
              reject(e)
            }
            // inject this script with the src set to the versioned remoteEntry.js
            document.head.appendChild(script);
          })
          `
  },
  exposes: {},
  shared: {
    "react": {
      "requiredVersion": "^18.2",
      "singleton": true,
      "eager": true
    },
    "react-dom": {
      "requiredVersion": "^18.2",
      "singleton": true,
      "eager": true
    },
    "@mui/material": {
      "requiredVersion": "^5.11.10",
      "singleton": true,
      "eager": true
    },
    "@emotion/react": {
      "requiredVersion": "^11.10.6",
      "singleton": true,
      "eager": true
    },
    "@emotion/styled": {
      "requiredVersion": "^11.10.6",
      "singleton": true,
      "eager": true
    },
    "lodash": {
      "requiredVersion": "^4.17.21",
      "singleton": true,
      "eager": true
    },
    "axios": {
      "requiredVersion": "^1.3.4",
      "singleton": true,
      "eager": true
    },
    "dompurify": {
      "requiredVersion": "^3.0.3",
      "singleton": true,
      "eager": true
    },
    "marked": {
      "requiredVersion": "^5.0.2",
      "singleton": true,
      "eager": true
    },
    "rxjs": {
      "requiredVersion": "^7.8.1",
      "singleton": true,
      "eager": true
    },
    "socket.io": {
      "requiredVersion": "^4.6.1",
      "singleton": true,
      "eager": true
    },
    "socket.io-client": {
      "requiredVersion": "^4.6.1",
      "singleton": true,
      "eager": true
    },
    "react-router-dom": {
      "requiredVersion": "^6.11.2",
      "singleton": true,
      "eager": true
    }
  }
}

if (stage === "prod") {
  // do not provide override capability
  federationConfig.remotes = Object.keys(remoteUrls.prod).reduce((s, k) => {
    return {
      ...s,
      [k]: k + '@' + remoteUrls.prod[k]
    }
  }, {})
}

if (process.env.DEV_DOMAIN !== undefined) {
  federationConfig.remotes = Object.keys(federationConfig.remotes).reduce((s, k) => {
    return {
      ...s,
      [k]: federationConfig.remotes[k].replace("localhost", process.env.DEV_DOMAIN)
    }
  }, {})
}

let rootDir = __dirname;
// find the root dir by iteratively going up until we find a package.json
while (!fs.existsSync(path.resolve(rootDir, "package.json")) && rootDir !== process.cwd() && rootDir !== "/") {
  rootDir = path.resolve(rootDir, "..");
}

Object.keys(federationConfig.exposes).forEach((k) => {
  const exposePath = path.resolve(rootDir, federationConfig.exposes[k]);
  if (!fs.existsSync(exposePath)) {
    console.warn("expose path does not exist: " + exposePath + " omitting from config")
    delete federationConfig.exposes[k];
  }
})

exports.federationConfig = federationConfig;
