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
// Note: 'serveStatic' and 'devtools' need different import/setup for local dev with ESM.
// For Vercel deployment, this part is now even simpler.
// If you need local devtools, this would be uncommented with appropriate ESM setup for it.
// For Vercel, this is implicitly handled by the route/build configuration.

// --- EXPORT THE APP FOR VERCEL ---
// Use 'export default' for ES Modules
export default app;
