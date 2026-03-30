import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "../config/db";
import { seedActions } from "./seed-actions";
import { seedEvents } from "./seed-events";
import { seedModules } from "./seed-modules";
import { seedChannels } from './seed-channels';
import { seedProvider } from './seed.provider';
import { seedConfigurationFields } from './seed.configurations.fields';

const seed = async () => {

  await connectDB();

  console.log("Seeding started...");

  await seedModules();
  await seedActions();
  await seedEvents();
  await seedChannels();
  await seedProvider();
  await seedConfigurationFields();

  console.log("Seeding completed");

  process.exit();
};

seed();