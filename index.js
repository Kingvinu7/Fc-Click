// Use 'import' for ES Modules
import { Frog } from 'frog';
import { serveStatic } from 'frog/serve-static';

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
app.use(serveStatic(__dirname, { root: 'public' })); // Keep this for local static serving

// This line enables the Frog devtools, useful for local testing in a browser.
// It's commented out by default for Vercel deployment to avoid potential conflicts,
// but you can uncomment it if you set up local development later.
// import { devtools } from 'frog/dev'; // You might need this import if devtools are uncommented
// devtools(app, { serveStatic }); // COMMENTED OUT FOR VERCEL

// --- EXPORT THE APP FOR VERCEL ---
// This is the CRUCIAL change: Export the handler function Vercel expects.
// Frog's `app.fetch` property is the universal handler for Vercel and other environments.
export default app.fetch;
