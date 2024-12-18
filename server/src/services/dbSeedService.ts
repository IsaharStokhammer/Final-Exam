import eventsData1 from "../data/globalterrorismdb_0718dist.json";
import eventsData2 from "../data/data2.json";
import TerrorEventModel from "../models/eventModel";

export const seedDatabase = async () => {
  console.log("מתחילים לטעון את הנתונים למסד הנתונים...");

  try {
    console.log("טוענים את הקובץ הראשון...");
    await TerrorEventModel.insertMany(eventsData1);
    console.log("הקובץ הראשון נטען בהצלחה.");

    console.log("טוענים את הקובץ השני...");
    await TerrorEventModel.insertMany(eventsData2);
    console.log("הקובץ השני נטען בהצלחה.");

    console.log("טעינת הנתונים למסד הנתונים הושלמה בהצלחה.");
  } catch (error) {
    console.error("שגיאה בטעינת הנתונים למסד הנתונים:", error);
  }
};
