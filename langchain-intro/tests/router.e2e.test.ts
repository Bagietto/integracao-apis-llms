import test from "node:test";
import assert from "node:assert/strict";
import {createServer} from "../src/server.ts";

test("command upper transform message into Upercase", async () => {
    const app = createServer();
    const msg ="make this message uppercase";
    const expected = msg.toUpperCase();

    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body:{ question: msg }
    })
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body, expected);
}); 