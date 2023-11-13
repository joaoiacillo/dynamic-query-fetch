
# dynamic-query-fetch

A Fetch API extension that adds dynamic query parameters.


## Installation

Use NPM to install the library package.

```bash
  npm install dynamic-query-fetch --save
```

## Usage

This library tries to reach a familiar approach to the _Axios_ library by implementing client creation to the Fetch API. Below is a quick example of how you can setup a client and send a GET request to a ficticious API and auto-set it's used version.

```js
require("dynamic-query-fetch");

const client = fetch.create({
    baseUrl: "https://fake-api.com",
    params: {
        version: ({ values }) => values.version || 2
    }
});

(async function() {
    const response = await client.get({
        path: "/data",
        values: { version: 3 }
    });

    const json = response.json();
    console.log(json);
})();
```
## Documentation

### Quick-jump

- [Requiring](#requiring)
- [Clients](#clients)
- [Requests](#requests)
- [Dynamic Parameters and Context Values](#dynamic-parameters-and-context-values)

### Requiring

As the library inserts the `create` method into the global `fetch` function, no value is actually retunerd by the `require` or `import`.

### Clients

Clients are the main wrappers for holding common properties between each request, just like what _Axios_ does. A client object provides access to [Request functions](#requests) for perfoming HTTP requests to the API.

#### properties

- `baseUrl` (string or URL): A common URL for using at the beginning of every request.
- `params` (object, optional): An object that contains common static and dynamic parameters.
- `defaultMethod` (string, default: "GET"): A valid HTTP method in **UPPERCASE**.

#### example

```js
const client = fetch.create({
    baseUrl: "",
    params: { },
    defaultMethod: "GET"
});
```

### Requests

A request is a function provided by the [Client](#clients) which performs an HTTP request. All common HTTP methods contain a request method, such as `GET` (which maps to `get`) and `POST` (which maps to `post`). All of these methods receive an object as a parameter that holds properties for that specific request.

#### properties

- `path` (string, default: "/"): An extra pathname to be appended to the URL.
- `method` (string): A required string that contains the method to be used. HTTP method wrappers override this property.
- `params` (object, optional): An object of static and dynamic parameters to add (overrides the client parameters).
- `values` (object, optional): An object of values to be passed to the dynamic parameters.
- `fetchOptions` (object): An object that holds Fetch API options.

#### methods

- `request`
- `get`
- `post`
- `put`
- `delete`
- `head`
- `connect`
- `options`
- `trace`
- `patch`

#### example

```js
const client = fetch.create({ /* ... */ });

await client.get({
    values: { version: 23 },
    params: { customParam: 20 }
});
```


### Dynamic Parameters and Context Values

The big goal of this library is to add dynamic parameters to the Fetch API, and it does. Dynamic parameters are query params that are re-evaluated after every request that is triggered.

Every dynamic parameter receive a `props` object that contains info about the current URL and a values object that provides all context values received from the request calls.

It is recommended that by using context values, you provide some sort of default value. e.g. (values.number || DEFAULT_NUM)

#### parameters

- `url` (string): A string representation of the current URL with all the current evaluated parameters.
- `values` (object): An object that contains data received from requests.

#### example

```js
const client = fetch.create({
    baseUrl: BASE_URL,
    params: {
        staticParam: 3000,
        dynamicParam: ({ url, values }) => {
            return url.length * (values.number || 10);
        }
    }
});

// Generated URL:
// https://fake-api.com?staticParam=3000&dynamicParam=370
```

## Contributing

This is a really simple project, so contributions are always welcome! Feel free to change anything.
