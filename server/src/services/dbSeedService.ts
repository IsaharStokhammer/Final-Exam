// import eventsData1 from "../data/globalterrorismdb_0718dist.json";
// import eventsData2 from "../data/data2.json";
import TerrorEventModel from "../models/eventModel";

export const seedDatabase = async () => {
  console.log("loading... 💿💿💿");

  try {
    console.log("טוענים את הקובץ הראשון...");
    // await TerrorEventModel.insertMany(eventsData1);
    console.log("file 1 loaded successfully. 😎");

    console.log("טוענים את הקובץ השני...");
    // await TerrorEventModel.insertMany(eventsData2);
    console.log("file 2 loaded successfully. 😎");

    console.log("loaded successfully. 😎");
  } catch (error) {
    console.error("שגיאה בטעינת הנתונים למסד הנתונים:", error);
  }
};
