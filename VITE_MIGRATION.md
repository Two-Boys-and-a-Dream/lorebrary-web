# Parcel to Vite Migration Summary

This document summarizes the changes made to convert the project from Parcel to Vite.

## Files Changed

### 1. **package.json**

- **Removed**: Parcel and Parcel-specific packages (`parcel`, `@parcel/babel-preset-env`, `@parcel/babel-plugin-transform-runtime`)
- **Added**: Vite and related packages (`vite`, `@vitejs/plugin-react`)
- **Scripts updated**:
  - `start`: Changed from `parcel --open -p 3000` to `vite --open --port 3000`
  - `dev`: Added as alternative dev command (`vite`)
  - `build`: Changed from `parcel build --public-url ./` to `tsc && vite build`
  - `preview`: Added for previewing production builds (`vite preview`)
- **Removed fields**: `source`, `browserslist` (Vite handles these differently)

### 2. **vite.config.ts** (NEW)

- Created Vite configuration file with React plugin
- Configured React Compiler plugin via Babel options
- Set server port to 3000 with auto-open
- Configured build output directory

### 3. **index.html**

- **Moved** from `src/index.html` to root directory (Vite requirement)
- **Updated** script src from `./index.tsx` to `/src/index.tsx` (Vite uses absolute paths from root)
- **Updated** favicon path from `assets/favicon.ico` to `/src/assets/favicon.ico`

### 4. **src/api/API.ts**

- Changed environment variable access from `process.env.API_URL` to `import.meta.env.VITE_API_URL`
- Note: Vite requires `VITE_` prefix for environment variables exposed to client code

### 5. **src/vite-env.d.ts** (NEW)

- Created TypeScript definition file for Vite environment variables
- Defines `ImportMetaEnv` interface with `VITE_API_URL`
- Extends `ImportMeta` interface to include `env` property

### 6. **.env.example** (NEW)

- Created example environment file documenting required variables
- Documents `VITE_API_URL` as required variable

### 7. \***\*mocks**/setupTests.ts\*\*

- Updated environment variable from `process.env.API_URL` to `process.env.VITE_API_URL`
- Added comment explaining that tests use `process.env` while app uses `import.meta.env`

### 8. **tsconfig.json**

- Added `useDefineForClassFields: true` (Vite/ES2022 compatibility)
- Added `vite/client` to `types` array for Vite type definitions
- Added `vite.config.ts` to `include` array

### 9. **babel.config.json**

- Removed Parcel-specific presets: `@parcel/babel-preset-env`, `@parcel/babel-plugin-transform-runtime`
- Added `@babel/preset-env` with Node.js target for Jest
- Added test environment configuration with `babel-plugin-transform-vite-meta-env` to transform `import.meta.env` to `process.env` in tests

### 10. **jest.config.js**

- Removed `globals` object (no longer needed with babel plugin)
- Added `!src/vite-env.d.ts` to `collectCoverageFrom` to exclude type definition file
- Added `testPathIgnorePatterns` to skip `vite.config.ts`
- Added `transformIgnorePatterns` to properly ignore Vite config
- Added `vite` to `moduleNameMapper` for proper module resolution

### 11. **.github/copilot-instructions.md**

- Updated project description from "Parcel" to "Vite"
- Updated tech stack to mention Vite instead of Parcel
- Added `npm run dev` and `npm run preview` to build commands
- Added comprehensive "Environment Variables" section documenting:
  - Required `VITE_` prefix for client-exposed variables
  - Usage of `import.meta.env.VITE_API_URL` in app code
  - Usage of `process.env.VITE_API_URL` in tests
  - Environment file management (`.env` vs `.env.example`)
- Updated test setup documentation to reflect `VITE_API_URL` variable name

## Key Differences: Parcel vs Vite

### Environment Variables

- **Parcel**: Uses `process.env.*` directly
- **Vite**: Uses `import.meta.env.VITE_*` (requires `VITE_` prefix for client exposure)

### HTML Entry Point

- **Parcel**: HTML in `src/` directory, specified via `source` field in package.json
- **Vite**: HTML at project root, uses absolute paths from root for script references

### Configuration

- **Parcel**: Minimal/no config (uses package.json fields)
- **Vite**: Explicit `vite.config.ts` for customization

### Build Command

- **Parcel**: Just `parcel build`
- **Vite**: Typically `tsc && vite build` (separate TypeScript check)

### Testing with Vite Environment Variables

- Jest runs in Node.js and doesn't natively support `import.meta.env`
- Solution: Use `babel-plugin-transform-vite-meta-env` to transform `import.meta.env` → `process.env` during test compilation
- Tests use `process.env.VITE_API_URL` in setup files

## Dependencies Added

- `vite@^6.0.1`
- `@vitejs/plugin-react@^4.3.4`
- `@babel/preset-env@^7.28.5`
- `babel-plugin-transform-vite-meta-env@latest`

## Dependencies Removed

- `parcel@^2.16.1`
- `@parcel/babel-preset-env@^2.16.1`
- `@parcel/babel-plugin-transform-runtime@^2.16.1`

## How to Use

1. **Install dependencies**: `npm install`
2. **Create `.env` file**: Copy `.env.example` to `.env` and set `VITE_API_URL`
3. **Development**: `npm start` or `npm run dev`
4. **Build**: `npm run build`
5. **Preview production build**: `npm run preview`
6. **Test**: `npm test`

## Benefits of Vite

- **Faster dev server**: Near-instant server start using native ESM
- **Faster HMR**: More efficient hot module replacement
- **Better build performance**: Uses esbuild for dependency pre-bundling
- **Modern by default**: Built for ES modules and modern JavaScript
- **Active ecosystem**: Large plugin ecosystem and active development
