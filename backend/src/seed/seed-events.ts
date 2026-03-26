import { eventsData } from "./data/events.data";
import { Modules } from "../models/communication-channel-models/module.models";
import { ModulesActions } from "../models/communication-channel-models/module.actions.models";
import { EventActions } from "../models/communication-channel-models/Notifications-models/event.actions.models";

export const seedEvents = async () => {
  try {

    for (const event of eventsData) {

      // 1️⃣ Find Module
      const module = await Modules.findOne({
        moduleKey: event.moduleKey
      });

      if (!module) {
        console.log(`Module not found: ${event.moduleKey}`);
        continue;
      }

      // 2️⃣ Find Action
      const action = await ModulesActions.findOne({
        actionKey: event.actionKey,
        moduleId: module._id
      });

      if (!action) {
        console.log(
          `Action not found: ${event.actionKey} in ${event.moduleKey}`
        );
        continue;
      }

      // 3️⃣ Insert Event
      await EventActions.updateOne(
        {
          eventKey: event.eventKey
        },
        {
          $set: {
            name: event.name,
            description: event.description,
            moduleId: module._id,
            actionId: action._id,
            variables: event.variables,
            isActive: true
          }
        },
        {
          upsert: true
        }
      );

      console.log(`Event seeded: ${event.eventKey}`);
    }

    console.log("✅ Events Seeded Successfully");

  } catch (error) {

    console.log("❌ Event Seed Error", error);

  }
};