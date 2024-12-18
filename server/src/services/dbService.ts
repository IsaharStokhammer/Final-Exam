import { Request, Response } from 'express';
import TerrorEventModel from '../models/eventModel';

export const getDeadliestAttackTypesService = async()=>{
    try {
        const attackTypesSortedToLow = await TerrorEventModel.aggregate([
            {
                $group: {
                    _id: "$attacktype1_txt",
                    totalKills: { $sum: { $ifNull: ["$nkill", 0] } },
                    totalWounds: { $sum: { $ifNull: ["$nwound", 0] } },
                }
            },
            {
                $addFields: {
                    totalCasualties: { $add: ["$totalKills", "$totalWounds"] }
                }
            },
            {
                $sort: { totalCasualties: -1 }
            },
            {
                $project: {
                    _id: 0,
                    attackType: "$_id",
                    totalCasualties: 1
                }
            }
        ]);
        return attackTypesSortedToLow
    } catch (error) {
        
    }




};

