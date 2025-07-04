// Use 'import' for ES Modules
import { Frog } from 'frog';
// import { serveStatic } from 'frog/serve-static'; // <--- REMOVE THIS LINE TOO!

// --- FROG APP SETUP ---
const app = new Frog({
  basePath: '/api/frame',
  initialState: {
    count: 0,
  },
});

// --- GAME LOGIC ---
app.frame('/api/frame', async (c) => {
  const { buttonValue, deriveState } = c;

  const state = deriveState((previousState) => {
    if (buttonValue === 'click') {
      previousState.count++;
    } else if (buttonValue === 'reset') {
      previousState.count = 0;
    }
  });

  const imageContent = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: #4CAF50; color: white; font-size: 60px; text-align: center;">
      <h1>Simple Clicker Game!</h1>
      <p style="font-size: 80px; margin-top: 20px;">Clicks: ${state.count}</p>
    </div>
  `;

  const buttons = [
    '<c.Button value="click">Click Me!</c.Button>',
    '<c.Button value="reset">Reset</c.Button>',
    '<c.Button.Link href="https://farcaster.xyz">Visit Farcaster</c.Button.Link>'
  ];

  return c.res({
    image: imageContent,
    intents: buttons,
  });
});

// --- Development Tools (for local testing only) ---
// The previous 'app.use(serveStatic(__dirname, { root: 'public' }));' line
// and its import are NOT needed for Vercel deployment and cause issues.
// Vercel handles serving static files automatically via vercel.json.

// This line enables the Frog devtools, useful for local testing in a browser.
// It's commented out by default for Vercel deployment to avoid potential conflicts.
// import { devtools } from 'frog/dev';
// devtools(app, { serveStatic }); // COMMENTED OUT FOR VERCEL


// --- EXPORT THE APP FOR VERCEL ---
export default app.fetch;
