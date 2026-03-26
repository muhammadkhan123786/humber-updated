import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from "../config/db";
import { seedActions } from "./seed-actions";
import { seedEvents } from "./seed-events";
import { seedModules } from "./seed-modules";



const seed = async () => {

  await connectDB();

  console.log("Seeding started...");

  await seedModules();
  await seedActions();
  await seedEvents();

  console.log("Seeding completed");

  process.exit();
};

seed();