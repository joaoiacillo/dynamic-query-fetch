/**
 * @readonly
 * @enum
 */
const HTTPMethod = {
    get: "GET",
    head: "HEAD",
    post: "POST",
    put: "PUT",
    delete: "DELETE",
    connect: "CONNECT",
    options: "OPTIONS",
    trace: "TRACE",
    patch: "PATCH"
}

function isHttpMethodValid(method) {
    return Object.values(HTTPMethod).includes(method);
}

/**
 * Holds query parameters.
 * @constructor
 * @param {{ [key: string]: string | number }} object
 */
function Parameters(object) {
    Object.assign(this, object);
}

/**
 * Holds properties for the Client. Default HTTP method is `GET`.
 * @constructor
 * @param {Object} props 
 * @param {string | URL} props.baseUrl 
 * @param {{ [key: string]: string | any }?} props.params 
 * @param {HTTPMethod?} props.defaultMethod
 */
function ClientProps({ baseUrl, params = {}, defaultMethod = HTTPMethod.get }) {
    if (typeof baseUrl !== "string" && !(baseUrl instanceof URL)) {
        throw new Error("Please provide a valid baseUrl");
    }

    if (!isHttpMethodValid(defaultMethod)) {
        throw new Error(`"${defaultMethod}" is not a valid HTTP method.`);
    }

    this.baseUrl = baseUrl;
    this.params = new Parameters(params);
    this.defaultMethod = defaultMethod;
}


/**
 * Holds properties for a Request.
 * @constructor
 * @param {Object} props
 * @param {string?} props.path
 * @param {HTTPMethod} props.method
 * @param {{ [key: string]: string | any }?} props.params 
 * @param {object?} props.values
 * @param {object?} props.fetchOptions
 */
function RequestProps({ path = "/", method, params = {}, values = {}, fetchOptions = {} }) {
    if (!isHttpMethodValid(method)) {
        throw new Error(`"${method}" is not a valid HTTP method.`);
    }
    this.path = path;
    this.method = method;
    this.params = new Parameters(params);
    this.values = values;
    this.fetchOptions = fetchOptions;

    this.toFetchOptions = () => ({
        ...this.fetchOptions,
        method
    });
}

/**
 * @constructor
 * @param {{ [key: string]: string | number }} object
 */
function ContextValues(object) {
    Object.assign(this, object);
}

/**
 * @constructor
 * @param {Object} props 
 * @param {string} props.url 
 * @param {object?} props.values 
 */
function Context({ url, values = {} }) {
    this.url = url;
    this.values = new ContextValues(values);
}

/**
 * @param {Context} ctx
 */
function evaluateParamValue(value, ctx) {
    return (typeof value === "function") ? value(ctx) : value;
}

/**
 * @param {Params} params 
 * @param {ContextValues} values
 */
function insertParamsIntoUrl(url, params, values) {
    Object.entries(params).forEach(([p, v]) => {
        const ctx = { url: url.href, values: values || {} };
        const evaluatedValue = evaluateParamValue(v, ctx);
        url.searchParams.set(p, evaluatedValue);
    });

    return url;
}

/**
 * Fetch client for using dynamic parameters.
 * 
 * @param {ClientProps} props 
 */
function FetchClient(props) {
    const clientProps = new ClientProps({
        defaultMethod: HTTPMethod.get,
        ...props
    });

    /**
     * @param {RequestProps} props
     */
    this.request = async (props) => {
        if (typeof props.params === "undefined") {
            props.params = clientProps.params;
        } else if (props.params !== null) {
            props.params = {
                ...clientProps.params,
                ...props.params
            }
        } else {
            props.params = {};
        }

        const reqProps = new RequestProps({
            method: clientProps.defaultMethod,
            ...props
        });

        const requestUrl = new URL(clientProps.baseUrl);
        requestUrl.pathname = (requestUrl.pathname + reqProps.path).replace(/\/+/g, "/");
        const finalUrl = insertParamsIntoUrl(requestUrl, reqProps.params, reqProps.values);

        return await fetch(finalUrl, {
            ...reqProps.fetchOptions,
            method: reqProps.method
        });
    };

    /**
     * @param {RequestProps} props
     **/
    this.get = async (props) => this.request({ ...props, method: "GET" });

    /**
     * @param {RequestProps} props
     **/
    this.head = async (props) => this.request({ ...props, method: "HEAD" });
    
    /**
     * @param {RequestProps} props
     **/
    this.post = async (props) => this.request({ ...props, method: "POST" });
    
    /**
     * @param {RequestProps} props
     **/
    this.put = async (props) => this.request({ ...props, method: "PUT" });

    /**
     * @param {RequestProps} props
     **/
    this.delete = async (props) => this.request({ ...props, method: "DELETE" });


    /**
     * @param {RequestProps} props
     **/
    this.connect = async (props) => this.request({ ...props, method: "CONNECT" });

    /**
     * @param {RequestProps} props
     **/
    this.options = async (props) => this.request({ ...props, method: "OPTIONS" });

    /**
     * @param {RequestProps} props
     **/
    this.trace = async (props) => this.request({ ...props, method: "TRACE" });

    /**
     * @param {RequestProps} props
     **/
    this.patch = async (props) => this.request({ ...props, method: "PATCH" });
}

/**
 * @param {ClientProps} props
 */
fetch.create = (props) => new FetchClient(props);
