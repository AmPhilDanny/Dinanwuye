# Local development

This repository uses one installed Node.js runtime and pnpm for JavaScript dependencies.

## Install once

- Keep Node.js installed at the machine level.
- Keep pnpm installed once through Corepack or npm.
- Use `pnpm install --frozen-lockfile` in `backend`, `frontend`, and `admin-frontend`.

pnpm stores package contents in one shared store and links them into each project. The projects still have separate lockfiles because they are separate deployable applications; sharing one `node_modules` folder would make their builds less reliable.

## Reclaim space

```powershell
pnpm store prune
npm cache clean --force
```

The generated `dist` and local `node_modules` folders are intentionally not committed. Remove a local `node_modules` folder only when that project is not running, then reinstall it with pnpm when needed.

## Backend services

The Node services already share the `backend` pnpm workspace and its package store. They remain separate Render services so one service can fail, deploy, or scale without taking down the others.