# file-api

### Requirements

1. Node Package Manager (NPM) is required. To install Node, download from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

2. Environment variables will need to be set.

- Run this command to set port:
  Windows

  ```
  set PORT=3000
  ```

  Mac

  ```
  export PORT=3000
  ```

### Installation of packages

- Run the command from the root directory:
  ```
  npm install
  ```
- Run the application:
  ```
  npm start
  ```
- Run unit tests:

```
    npm run test
```

- Base Url: `http://localhost:3000/`. This can be accessed in your web browser. A JSON with status of UP `{"status":"UP"}` will be displayed. You can import the sample postman collection, which is added to the root directory to test the API `FileAPI.postman_collection`.

### 4. Deployment

Application is hosted on Heroku [https://ezpay-file-api.herokuapp.com/](https://ezpay-file-api.herokuapp.com/)
