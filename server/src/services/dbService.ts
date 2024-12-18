import { Request, Response } from "express";
import TerrorEventModel from "../models/eventModel";

export const getDeadliestAttackTypesService = async () => {
  try {
    const attackTypesSortedToLow = await TerrorEventModel.aggregate([
      {
        $group: {
          _id: "$attacktype1_txt",
          totalKills: { $sum: { $ifNull: ["$nkill", 0] } },
          totalWounds: { $sum: { $ifNull: ["$nwound", 0] } },
        },
      },
      {
        $addFields: {
          totalCasualties: { $add: ["$totalKills", "$totalWounds"] },
        },
      },
      {
        $sort: { totalCasualties: -1 },
      },
      {
        $project: {
          _id: 0,
          attackType: "$_id",
          totalCasualties: 1,
        },
      },
    ]);
    return attackTypesSortedToLow;
  } catch (error) {}
};


export interface HighestCasualtyRegion {
  regionType: string;
  regionName: string;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  averageCasualties: number;
}

export const getHighestCasualtyRegionsService = async (): Promise<HighestCasualtyRegion[]> => {
  try {
    const highestCasualtyRegions = await TerrorEventModel.aggregate([
      {
        $addFields: {
          casualties: {
            $add: [
              { $ifNull: ["$nkill", 0] },
              { $ifNull: ["$nwound", 0] }
            ]
          }
        }
      },
      {
        $facet: {
          topCities: [
            {
              $group: {
                _id: "$city",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" }
              }
            },
            { $sort: { averageCasualties: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                regionType: { $literal: "City" },
                regionName: "$_id",
                coordinates: {
                  latitude: "$latitude",
                  longitude: "$longitude"
                },
                averageCasualties: { $round: ["$averageCasualties", 2] }
              }
            }
          ],
          topCountries: [
            {
              $group: {
                _id: "$country_txt",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" }
              }
            },
            { $sort: { averageCasualties: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                regionType: { $literal: "Country" },
                regionName: "$_id",
                coordinates: {
                  latitude: "$latitude",
                  longitude: "$longitude"
                },
                averageCasualties: { $round: ["$averageCasualties", 2] }
              }
            }
          ],
          topRegions: [
            {
              $group: {
                _id: "$region_txt",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" }
              }
            },
            { $sort: { averageCasualties: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                regionType: { $literal: "Region" },
                regionName: "$_id",
                coordinates: {
                  latitude: "$latitude",
                  longitude: "$longitude"
                },
                averageCasualties: { $round: ["$averageCasualties", 2] }
              }
            }
          ]
        }
      },
      {
        $project: {
          regions: {
            $concatArrays: ["$topCities", "$topCountries", "$topRegions"]
          }
        }
      },
      { $unwind: "$regions" },
      {
        $replaceRoot: { newRoot: "$regions" }
      }
    ]);

    return highestCasualtyRegions as HighestCasualtyRegion[];
  } catch (error) {
    console.error("Error in getHighestCasualtyRegionsService:", error);
    throw new Error("Failed to fetch highest casualty regions");
  }
};


//  טעות בשאלה!!!!!! אוף! אחרי שעכה שאני יושב על זה


// interface TopAverageCasualtyCity {
//   attackType: string;
//   city: string;
//   country: string;
//   coordinates: {
//     latitude: number | null;
//     longitude: number | null;
//   };
//   averageCasualties: number;
// }

// export const getTopAverageCasualtyCities = async (): Promise<TopAverageCasualtyCity[]> => {
//   try {
//     const topAverageCasualtyCities = await TerrorEventModel.aggregate([
//       {
//         $addFields: {
//           casualties: {
//             $add: [
//               { $ifNull: ["$nkill", 0] },
//               { $ifNull: ["$nwound", 0] }
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             attackType: "$attacktype1_txt",
//             city: "$city",
//             country: "$country_txt",
//             latitude: "$latitude",
//             longitude: "$longitude"
//           },
//           averageCasualties: { $avg: "$casualties" }
//         }
//       },
//       {
//         $sort: { "_id.attackType": 1, "averageCasualties": -1 }
//       },
//       {
//         $group: {
//           _id: "$_id.attackType",
//           city: { $first: "$_id.city" },
//           country: { $first: "$_id.country" },
//           latitude: { $first: "$_id.latitude" },
//           longitude: { $first: "$_id.longitude" },
//           averageCasualties: { $first: "$averageCasualties" }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           attackType: "$_id",
//           city: 1,
//           country: 1,
//           coordinates: {
//             latitude: "$latitude",
//             longitude: "$longitude"
//           },
//           averageCasualties: { $round: ["$averageCasualties", 2] }
//         }
//       }
//     ]);

//     return topAverageCasualtyCities as TopAverageCasualtyCity[];
//   } catch (error) {
//     console.error("Error in getTopAverageCasualtyCities:", error);
//     throw new Error("Failed to fetch top average casualty cities");
//   }
// };

