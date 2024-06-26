import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string); // This line is connecting the project with mongoDB
    seedSuperAdmin(); // Automatically creates a super-admin without user input when the database is first connected
    server = app.listen(config.port, () => {
      console.log(`App listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// Handling unhandled Rejection (Asynchronous code)
process.on('unhandledRejection', () => {
  console.log('👍👍 unhandled Rejection detected. Shutting down 👍👍');
  if (server) {
    server.close(() => {
      process.exit(1); // If server runs any asynchronous code, we need to let it finish the process and then shut off
    });
  }
  process.exit(1); // If server has no running process, then it can immediately shut off
});

// Handling Uncaught Exception (Synchronous code)
process.on('uncaughtException', () => {
  console.log('👍👍 Uncaught Exception detected. Shutting down 👍👍');
  process.exit(1); // Shut off immediately when it is a synchronous code
});

// console.log(x);
