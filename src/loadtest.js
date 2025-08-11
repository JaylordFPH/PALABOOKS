import autocannon from 'autocannon'

async function run() {
  const result = await autocannon({
    url: 'http://localhost:4000/api/login',
    connections: 200,
    amount: 1000,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test1@gmail.com', password: 'test1' })
  });

  console.log(result);
}

run().catch(console.error);
