# How to Build End to End Encrypted Chat App with CometChat

Read the full tutorial here: [**>> How to Build End to End Encrypted Chat App with CometChat**](https://www.cometchat.com/tutorials/#)

## Technology

This demo uses:

- CometChat Pro 3.0.0
- CometChat UI Kit
- Firebase
- React.js
- Uuid
- Validator
- Node.js
- Dotenv
- Cors
- Express
- Virgil Crypto
- Virgil SDK

## Running the demo

### Running the client side code.

To run the client side code, please follow these steps:

1. [Head to CometChat Pro and create an account](https://app.cometchat.com/signup)
2. From the [dashboard](https://app.cometchat.com/apps), add a new app called **"e2e-encrypted-chat-app"**
3. Select this newly added app from the list.
4. From the Quick Start copy the **APP_ID, APP_REGION and AUTH_KEY**. These will be used later.
5. Navigate to the Users tab, and delete all the default users and groups leaving it clean **(very important)**.
6. Download the repository [here](https://github.com/hieptl/e2e-encrypted-chat-app/archive/main.zip) or by running `git clone https://github.com/hieptl/e2e-encrypted-chat-app.git` and open it in a code editor.
7. [Head to Firebase and create a new project](https://console.firebase.google.com)
8. Create a file called **.env** in the root folder of your project.
9. Import and inject your secret keys in the **.env** file containing your CometChat and Firebase in this manner.

```js
REACT_APP_FIREBASE_API_KEY=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREBASE_DATABASE_URL=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREABSE_MESSAGING_SENDER_ID=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_FIREBASE_APP_ID=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx

REACT_APP_COMETCHAT_APP_ID=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_COMETCHAT_REGION=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
REACT_APP_COMETCHAT_AUTH_KEY=xxx-xxx-xxx-xxx-xxx-xxx-xxx-xxx
```

10. Make sure to exclude **.env** in your gitIgnore file from being exposed online.
11. Run the following command to install the app.

```sh
  npm install
  npm run start
```

### Running the server side code. 

To run the server side code, please follow the below steps:

1. [Head to Virgil Security and create an account](https://dashboard.virgilsecurity.com/signup).
2. From the [dashboard](https://dashboard.virgilsecurity.com/apps), add a new app called **"e2e-encrypted-chat-app"**
3. Select this newly added app from the list.
4. Navigate to the E3Kit section and generate the environment variables. Those variables will be used in the following steps.
5. Create a file called **.env** in the root folder of your project.
6. Import and inject your secret keys in the **.env** file containing your Virgil Security in this manner.
7. Make sure to exclude **.env** in your gitIgnore file from being exposed online.
8. Cd to the project directory and run the following commands to install and run the app.

```sh
  npm install
  node index.js
```

Questions about running the demo? [Open an issue](https://github.com/hieptl/e2e-encrypted-chat-app/issues). We're here to help ✌️

## Useful links

- 🏠 [CometChat Homepage](https://app.cometchat.com/signup)
- 🚀 [Create your free account](https://app.cometchat.com/apps)
- 📚 [Documentation](https://www.cometchat.com/docs)
- 👾 [GitHub](https://www.github.com/cometchat-pro)
- 🔥 [Firebase](https://console.firebase.google.com)
- 🔷 [React.js](https://reactjs.org/)
- ✨ [Node.js](https://nodejs.org/en/)
- ✨ [Virgil Security](https://virgilsecurity.com)