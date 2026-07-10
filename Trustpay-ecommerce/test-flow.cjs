console.log("DEBUG: The script is officially running!");
const http = import('http');
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write("RESPONSE: " + d));
});
req.on('error', (e) => console.error("CONNECTION ERROR: " + e.message));
req.write(JSON.stringify({ name: "Test Laptop", price: 1000, sellerId: "seller123" }));
req.end();
