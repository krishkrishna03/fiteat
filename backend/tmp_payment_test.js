const fetch = globalThis.fetch || require('node-fetch');
(async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fittransform.com', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    console.log('login', loginRes.status, loginData);
    const token = loginData.token;
    const planRes = await fetch('http://localhost:5000/api/plans', { method: 'GET' });
    const plans = await planRes.json();
    console.log('plans status', planRes.status);
    if (!plans.length) return;
    const planId = plans[0]._id;
    console.log('using planId', planId);
    const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ planId })
    });
    const orderData = await orderRes.json();
    console.log('create-order', orderRes.status, orderData);
  } catch (e) {
    console.error(e);
  }
})();
