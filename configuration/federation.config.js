// host federation.config.js

const fs = require("fs");
const path = require("path");
const stage = process.env.BUILD_STAGE ?? "beta";

const participants = {
  starter: "http://localhost:4001/remoteEntry.js",
};

const remoteUrls = {
  local: {},
  beta: {},
  gamma: {},
  prod: {},
};

Object.keys(participants).forEach((p) => {
  Object.keys(remoteUrls).forEach((stage) => {
    remoteUrls[stage][p] = participants[p];
  });
});

const remotes = {}

Object.keys(participants).forEach((p)=> {
  remotes[p] = dynamicRemote(p, remoteUrls[stage][p])
})

federationConfig = {
  name: "host",
  filename: "remoteEntry.js",
  remotes,
  exposes: {},
  shared: {
    react: {
      requiredVersion: "^18.2",
      singleton: true,
      eager: true,
    },
    "react-dom": {
      requiredVersion: "^18.2",
      singleton: true,
      eager: true,
    },
    "@mui/material": {
      requiredVersion: "^5.11.10",
      singleton: true,
      eager: true,
    },
    "@emotion/react": {
      requiredVersion: "^11.10.6",
      singleton: true,
      eager: true,
    },
    "@emotion/styled": {
      requiredVersion: "^11.10.6",
      singleton: true,
      eager: true,
    },
    lodash: {
      requiredVersion: "^4.17.21",
      singleton: true,
      eager: true,
    },
    axios: {
      requiredVersion: "^1.3.4",
      singleton: true,
      eager: true,
    },
    dompurify: {
      requiredVersion: "^3.0.3",
      singleton: true,
      eager: true,
    },
    marked: {
      requiredVersion: "^5.0.2",
      singleton: true,
      eager: true,
    },
    rxjs: {
      requiredVersion: "^7.8.1",
      singleton: true,
      eager: true,
    },
    "socket.io": {
      requiredVersion: "^4.6.1",
      singleton: true,
      eager: true,
    },
    "socket.io-client": {
      requiredVersion: "^4.6.1",
      singleton: true,
      eager: true,
    },
    "react-router-dom": {
      requiredVersion: "^6.11.2",
      singleton: true,
      eager: true,
    },
  },
};

if (stage === "prod") {
  // do not provide override capability
  federationConfig.remotes = Object.keys(remoteUrls.prod).reduce((s, k) => {
    return {
      ...s,
      [k]: k + "@" + remoteUrls.prod[k],
    };
  }, {});
}

if (process.env.DEV_DOMAIN !== undefined) {
  federationConfig.remotes = Object.keys(federationConfig.remotes).reduce(
    (s, k) => {
      return {
        ...s,
        [k]: federationConfig.remotes[k].replace(
          "localhost",
          process.env.DEV_DOMAIN
        ),
      };
    },
    {}
  );
}

let rootDir = __dirname;
// find the root dir by iteratively going up until we find a package.json
while (
  !fs.existsSync(path.resolve(rootDir, "package.json")) &&
  rootDir !== process.cwd() &&
  rootDir !== "/"
) {
  rootDir = path.resolve(rootDir, "..");
}

Object.keys(federationConfig.exposes).forEach((k) => {
  const exposePath = path.resolve(rootDir, federationConfig.exposes[k]);
  if (!fs.existsSync(exposePath)) {
    console.warn(
      "expose path does not exist: " + exposePath + " omitting from config"
    );
    delete federationConfig.exposes[k];
  }
});

exports.federationConfig = federationConfig;

function dynamicRemote(name, useUrlParams) {
  const remoteUrl = useUrlParams
    ? `const urlParams = new URLSearchParams(window.location.search)
  const override = urlParams.get("${name}")
  // This part depends on how you plan on hosting and versioning your federated modules
  const remoteUrl = override || '${remoteUrls[stage][name]}'`
    : `const remoteUrl = '${remoteUrls[stage][name]}'`;

  return `promise new Promise((resolve, reject) => {
    ${remoteUrl}
    const script = document.createElement('script')
    script.src = remoteUrl
    script.onload = () => {
      // the injected script has loaded and is available on window
      // we can now resolve this Promise
      if(!window['${name}']) {
        reject('remote container not found')
      }
      const proxy = {
        get: (request) => window['${name}'].get(request),
        init: (arg) => {
          try {
            return window['${name}'].init(arg)
          } catch(e) {
            console.log('remote container already initialized')
          }
        }
      }
      resolve(proxy)
    }
    script.onerror = (e) => {
        // the injected script errored during loading
        console.error(\`error loading remote entry ${name} \`)
        reject(e)
    }
    // inject this script with the src set to the remote remoteEntry.js
    document.head.appendChild(script);
  })
  `;
}
