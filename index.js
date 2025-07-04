// Use 'import' for ES Modules
import { Frog } from 'frog';
import { serveStatic } from 'frog/serve-static';

// --- FROG APP SETUP ---
const app = new Frog({
  // `basePath` must match the path Farcaster uses to access your frame (and Vercel's route).
  basePath: '/api/frame',

  // `initialState` defines the starting values for your game.
  // This state will be unique for each user playing the game.
  initialState: {
    count: 0, // Our counter for the clicker game
  },
});

// --- GAME LOGIC ---
// This function runs every time a user interacts with your Farcaster Mini App.
app.frame('/api/frame', async (c) => {
  const { buttonValue, deriveState } = c;

  // Update the game state based on button clicks
  const state = deriveState((previousState) => {
    if (buttonValue === 'click') {
      previousState.count++;
    } else if (buttonValue === 'reset') {
      previousState.count = 0;
    }
  });

  // --- Prepare Image and Buttons for the Frame ---
  const imageContent = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: #4CAF50; color: white; font-size: 60px; text-align: center;">
      <h1>Simple Clicker Game!</h1>
      <p style="font-size: 80px; margin-top: 20px;">Clicks: ${state.count}</p>
    </div>
  `;

  const buttons = [
    '<c.Button value="click">Click Me!</c.Button>',
    '<c.Button value="reset">Reset</c.Button>',
    '<c.Button.Link href="https://farcaster.xyz">Visit Farcaster</c.Button.Link>' // Example link button
  ];

  // Return the Farcaster Frame response (image and buttons)
  return c.res({
    image: imageContent, // The HTML content that satori converts into an image
    intents: buttons,    // The buttons to display below the image
  });
});

// --- Development Tools (for local testing only) ---
// IMPORTANT: This line uses __dirname, which is not defined in ES Module scope on Vercel.
// Vercel handles serving static files automatically via vercel.json.
// So, this line is intentionally commented out for Vercel deployment.
// app.use(serveStatic(__dirname, { root: 'public' }));

// This line enables the Frog devtools, useful for local testing in a browser.
// It's commented out by default for Vercel deployment to avoid potential conflicts.
// import { devtools } from 'frog/dev';
// devtools(app, { serveStatic }); // COMMENTED OUT FOR VERCEL


// --- EXPORT THE APP FOR VERCEL ---
// This is the CRUCIAL line that tells Vercel how to run your application.
// Frog's `app.fetch` property is the universal handler for Vercel and other environments.
export default app.fetch;
