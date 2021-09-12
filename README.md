# Web Programming Butler

> WP Butler is a project developed for the web programming class.

## Development

### Setup Firebase Credentials

1. Follow Firebase setup steps and retain the credentials.
2. Create `Config.ts` besides `IConfig.ts`, paste in the following template and fill in the fields retained from Firebase.

```typescript
import IConfig from "./IConfig";

const Config: IConfig = {
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  },
};
export default Config;
```

### Dev server

This will start a Vite dev server.

```
npm run dev
```

### Build

This will build the app.

```
npm run build
```
