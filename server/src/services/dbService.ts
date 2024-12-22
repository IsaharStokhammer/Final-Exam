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

export const getHighestCasualtyRegionsService = async (): Promise<
  HighestCasualtyRegion[]
> => {
  try {
    const highestCasualtyRegions = await TerrorEventModel.aggregate([
      {
        $addFields: {
          casualties: {
            $add: [{ $ifNull: ["$nkill", 0] }, { $ifNull: ["$nwound", 0] }],
          },
        },
      },
      {
        $facet: {
          topCities: [
            {
              $group: {
                _id: "$city",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" },
              },
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
                  longitude: "$longitude",
                },
                averageCasualties: { $round: ["$averageCasualties", 2] },
              },
            },
          ],
          topCountries: [
            {
              $group: {
                _id: "$country_txt",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" },
              },
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
                  longitude: "$longitude",
                },
                averageCasualties: { $round: ["$averageCasualties", 2] },
              },
            },
          ],
          topRegions: [
            {
              $group: {
                _id: "$region_txt",
                averageCasualties: { $avg: "$casualties" },
                latitude: { $first: "$latitude" },
                longitude: { $first: "$longitude" },
              },
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
                  longitude: "$longitude",
                },
                averageCasualties: { $round: ["$averageCasualties", 2] },
              },
            },
          ],
        },
      },
      {
        $project: {
          regions: {
            $concatArrays: ["$topCities", "$topCountries", "$topRegions"],
          },
        },
      },
      { $unwind: "$regions" },
      {
        $replaceRoot: { newRoot: "$regions" },
      },
    ]);

    return highestCasualtyRegions as HighestCasualtyRegion[];
  } catch (error) {
    console.error("Error in getHighestCasualtyRegionsService:", error);
    throw new Error("Failed to fetch highest casualty regions");
  }
};

export const getTrendsForYearsService = async (
  startYear: number,
  endYear: number
): Promise<any[]> => {
  try {
    const trends = await TerrorEventModel.aggregate([
      {
        $match: { iyear: { $gte: startYear, $lte: endYear } }, // סינון לפי טווח השנים
      },
      {
        $facet: {
          perType: [
            {
              $group: {
                _id: { year: "$iyear", attackType: "$attacktype1_txt" },
                count: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: "$_id.year",
                attackTypes: {
                  $push: {
                    attackType: "$_id.attackType",
                    count: "$count",
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id",
                attackTypes: 1,
              },
            },
          ],
          total: [
            {
              $group: {
                _id: "$iyear",
                totalCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id",
                totalCount: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          perType: 1,
          total: 1,
        },
      },
    ]);

    const perType = trends[0].perType;
    const total = trends[0].total;

    const result: any[] = perType.map((item: any) => {
      const totalItem = total.find((t: any) => t.year === item.year);
      return {
        year: item.year,
        attackTypes: item.attackTypes,
        totalCount: totalItem ? totalItem.totalCount : 0,
      };
    });

    for (let year = startYear; year <= endYear; year++) {
      if (!result.find((r) => r.year === year)) {
        result.push({
          year,
          attackTypes: [],
          totalCount: 0,
        });
      }
    }

    result.sort((a, b) => a.year - b.year);

    return result;
  } catch (error) {
    console.error("Error in getTrendsForYearsService:", error);
    throw new Error("Failed to fetch trends for years");
  }
};

//--אין כזאת דרישה אבל זה מגניב😉  מחזיר את חמשת הארגונים הקטלניים בעולם
export const getTopGroupsService = async (): Promise<any[]> => {
  try {
    const topGroups = await TerrorEventModel.aggregate([
      {
        $group: {
          _id: "$gname",
          totalCasualties: {
            $sum: {
              $add: [{ $ifNull: ["$nkill", 0] }, { $ifNull: ["$nwound", 0] }],
            },
          },
          totalKills: { $sum: { $ifNull: ["$nkill", 0] } },
          totalWounds: { $sum: { $ifNull: ["$nwound", 0] } },
          eventCount: { $sum: 1 },
        },
      },
      { $sort: { totalCasualties: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          groupName: "$_id",
          totalCasualties: 1,
          totalKills: 1,
          totalWounds: 1,
          eventCount: 1,
        },
      },
    ]);

    return topGroups;
  } catch (error) {
    console.error("Error in getTopGroupsService:", error);
    throw new Error("Failed to fetch top groups");
  }
};

export const getTopGroupsByRegionService = async (
  region: string,
  limit?: number
): Promise<any[]> => {
  try {
    const pipeline: any[] = [
      {
        $match: { region_txt: region },
      },
      {
        $group: {
          _id: "$gname",
          totalCasualties: {
            $sum: {
              $add: [{ $ifNull: ["$nkill", 0] }, { $ifNull: ["$nwound", 0] }],
            },
          },
          totalKills: { $sum: { $ifNull: ["$nkill", 0] } },
          totalWounds: { $sum: { $ifNull: ["$nwound", 0] } },
          eventCount: { $sum: 1 },
        },
      },
      { $sort: { totalCasualties: -1 } },
      {
        $project: {
          _id: 0,
          groupName: "$_id",
          totalCasualties: 1,
          totalKills: 1,
          totalWounds: 1,
          eventCount: 1,
        },
      },
    ];

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    return await TerrorEventModel.aggregate(pipeline);
  } catch (error) {
    console.error("Error in getTopGroupsByRegionService:", error);
    throw new Error("Failed to fetch top groups by region");
  }
};

export const getGroupsByYearService = async (year: number): Promise<any[]> => {
  try {
    const groups = await TerrorEventModel.aggregate([
      {
        $match: { iyear: year },
      },
      {
        $group: {
          _id: "$gname",
          totalIncidents: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          groupName: "$_id",
          totalIncidents: 1,
        },
      },
    ]);

    return groups;
  } catch (error) {
    console.error("Error in getGroupsByYearService:", error);
    throw new Error("Failed to fetch groups by year");
  }
};

export const getYearsByGroupService = async (
  groupName: string
): Promise<any[]> => {
  try {
    const years = await TerrorEventModel.aggregate([
      {
        $match: { gname: groupName },
      },
      {
        $group: {
          _id: "$iyear",
          totalIncidents: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          totalIncidents: 1,
        },
      },
    ]);

    return years;
  } catch (error) {
    console.error("Error in getYearsByGroupService:", error);
    throw new Error("Failed to fetch years by group");
  }
};

export const getDeadliestRegionsOfGroupService = async ({ orgName }: any) => {
  const result = await TerrorEventModel.aggregate([
    {
      $group: {
        _id: { region: "$region_txt", org: "$gname" },
        totalCasualties: {
          $sum: {
            $add: [{ $ifNull: ["$nkill", 0] }, { $ifNull: ["$nwound", 0] }],
          },
        },
      },
    },

    {
      $sort: {
        "_id.region": 1,
        totalCasualties: -1,
      },
    },

    {
      $group: {
        _id: "$_id.region",
        topOrg: { $first: "$_id.org" },
        totalCasualties: { $first: "$totalCasualties" },
      },
    },

    {
      $match: {
        topOrg: orgName,
      },
    },

    {
      $project: {
        _id: 0,
        region: "$_id",
        topOrg: 1,
        totalCasualties: 1,
      },
    },
  ]);

  return result;
};
