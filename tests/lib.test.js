require("../lib/index");

describe("Testing fetch client with fake-mock database", () => {
    const testUuids = [
        "D8494FA0-D3B9-649D-4323-172B5906A65A",
        "41E01554-96EA-BD67-DAED-265C6176922B",
        "9334CD19-CD69-11F9-EB63-2C213CC81B23",
        "9C18F993-8C4C-2201-D42E-69E3A32AB372",
        "56F79406-20DC-DB6A-E583-6626C667CD48",
        "49E3813C-C986-EBD4-D64A-384B3441EA88",
        "678C7B24-8A1E-A582-13C7-48588DEDA675",
        "1EAF36AC-9223-79E2-C4C6-370057CCD92E"
    ];

    const client = fetch.create({
        baseUrl: "https://my-json-server.typicode.com/joaoiacillo/fake-mock/users",
        params: {
            id: ({ values }) => {
                if (typeof values.uuid === "string") {
                    return values.uuid;
                }

                return testUuids[Math.floor(Math.random() * testUuids.length)];
            }
        }
    });

    test("it should return a specific user by overriding id parameter", async () => {
        const inputUuid = "41E01554-96EA-BD67-DAED-265C6176922B";
        const outputName = "Tanya Nunez";

        const response = await client.get({
            params: {
                // Request parameters should override client parameters
                id: inputUuid
            }
        });

        const json = await response.json();
        expect(json[0].name).toEqual(outputName);
    });

    test("it should return a specific user by providing the uuid as a context value", async () => {
        const inputUuid = "41E01554-96EA-BD67-DAED-265C6176922B";
        const outputName = "Tanya Nunez";

        const response = await client.get({
            values: {
                uuid: inputUuid
            }
        });

        const json = await response.json();
        expect(json[0].name).toEqual(outputName);
    });

    test("it should post a new user", async () => {
        const input = {
            id: "4E578D13-C965-49EB-85C8-C785080B87F9",
            name: "Fake user"
        };

        const expectedStatus = 201; // Created

        const response = await client.post({
            // Query parameters should be deactivated by providing null
            params: null,
            fetchOptions: {
                body: input
            }
        });

        expect(response.status).toEqual(expectedStatus);
    });

    test("it should delete a user", async () => {
        const uuid = "9334CD19-CD69-11F9-EB63-2C213CC81B23";
        const expectedStatus = 200;

        const response = await client.delete({
            params: null,
            path: "/" + uuid
        });

        expect(response.status).toEqual(expectedStatus);
    });
});

describe("Testing fetch client for possible errors", () => {
    test("it should throw an error for invalid baseUrls", () => {
        expect(() => fetch.create()).toThrow("Please provide a valid baseUrl");
        expect(() => fetch.create({ baseUrl: 123 })).toThrow("Please provide a valid baseUrl");
        expect(() => fetch.create({ baseUrl: null })).toThrow("Please provide a valid baseUrl");
    });

    test("it should throw an error for invalid HTTP methods", () => {
        expect(() => fetch.create({ baseUrl: "https://website.com", defaultMethod: "UNKNOWN" })).toThrow('"UNKNOWN" is not a valid HTTP method.');
    });
});
