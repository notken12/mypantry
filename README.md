# MyPantry

Do you run a pantry and want help managing its inventory or want to find more donators and recipients? MyPantry can help!

MyPantry is an app that lets you create, manage, and share pantries. Easily manage your inventory and share your pantry with a link so everyone can see where you're located and what you offer. MyPantry lets people easily check items in and out of your pantry.

# Todo

- [x] POST pantry
  - [x] Auth
  - [x] DB
- [x] GET pantry
- [ ] PUT pantry
- [ ] DELETE pantry
- [x] Firebase Auth
- [ ] Homepage
- [ ] About us page
- [ ] Dashboard
  - [x] My Pantries view
  - [x] Create pantry button
- [ ] Pantry dashboard
  - [ ] Inventory
    - [x] Item listing
    - [x] Create new item
      - [x] Name item
      - [x] Specify amount
    - [ ] Check-in/out item (brings you to check-in/check-out page)
  - [ ] Info
  - [ ] Share button
    - [ ] Copies url
  - [ ] Invite owners
  - [ ] View history
  - [x] Delete pantry
- [ ] Check-in/check-out
  - [ ] Use link or scan code
  - [ ] Listing of items
    - [ ] Click on item and specify amount
  - [ ] Create new item
    - [ ] Name item
    - [ ] Specify amount
  - [ ] Confirm and send to owners for verification

## Made with SvelteKit

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
