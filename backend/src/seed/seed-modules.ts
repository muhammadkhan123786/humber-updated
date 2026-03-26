import { Modules } from "../models/communication-channel-models/module.models";
import { modulesData } from "./data/modules.data";

export const seedModules = async () => {

  for (const module of modulesData) {

    const exists = await Modules.findOne({
      moduleKey: module.moduleKey
    });

    if (!exists) {

      await Modules.create(module);

      console.log("Module added:", module.moduleKey);

    }

  }

};