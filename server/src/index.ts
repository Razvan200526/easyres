import 'reflect-metadata';
import '@shared/env';
import { env } from '@shared/env';
import { pe } from '@shared/utils';
import { app } from './App';
import { PrimaryDatabase } from './shared/database/PrimaryDatabase';

async function initializeDatabase(retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const database = new PrimaryDatabase();
      const source = database.getSource();
      await source.initialize();
      return;
    } catch (error) {
      console.warn(`Database connection attempt ${i + 1} failed:`, error);

      if (i === retries - 1) {
        console.error(
          pe.render(
            `Error synchronizing database after ${retries} attempts: ${error}`,
          ),
        );
        process.exit(1);
      }

      const waitTime = delay * 2 ** i;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

await initializeDatabase();
// async function startServer() {
//   const port = Number(env.PORT || 2000);
//   try {
//     Bun.serve({
//       port: port,
//       fetch: app.fetch,
//     });
//     console.debug(color.magentaBright(`Server started on port : ${port}`));
//   } catch (e) {
//     if (e instanceof Error) {
//       console.error(pe.render(e));
//     }
//     console.error(e);
//     process.exit(1);
//   }
// }

// startServer();

export default {
  port: Number(env.PORT),
  hostname: "0.0.0.0",
  fetch: app.fetch
}