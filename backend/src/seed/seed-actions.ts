import { actionsData } from "./data/actions.data";
import { Modules } from "../models/communication-channel-models/module.models";
import { ModulesActions } from "../models/communication-channel-models/module.actions.models";

export const seedActions = async () => {
  try {
    for (const moduleItem of actionsData) {

      // 1️⃣ find module using moduleKey
      const module = await Modules.findOne({
        moduleKey: moduleItem.moduleKey
      });

      if (!module) {

        console.log(
          `Module not found: ${moduleItem.moduleKey}`
        );
        continue;
      }

      // 2️⃣ loop actions
      for (const action of moduleItem.actions) {

        await ModulesActions.updateOne(
          {
            actionKey: action.actionKey,
            moduleId: module._id
          },
          {
            $set: {
              name: action.name,
              moduleId: module._id
            }
          },
          {
            upsert: true
          }
        );
        console.log(
          `Action seeded: ${action.name}`
        );
      }
    }
    console.log("✅ Actions Seeded Successfully");

  } catch (error) {

    console.log("❌ Error seeding actions", error);

  }
};
