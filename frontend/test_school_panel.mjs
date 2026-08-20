import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5173/login');
  
  // Login with test
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'test1234');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to /school-panel
  await page.waitForNavigation();
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();
