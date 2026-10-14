const assert = require('assert');
const app = require('./app');

const server = app.listen(0, async () => {
    const { port } = server.address();
    const res = await fetch(`http://localhost:${port}/health`);
    assert.strictEqual(res.status, 200);
    console.log('Test OK');
    server.close();
});