import express, { Request, Response } from "express";
import { createResponse } from "../utils/utils";
import { getDeadliestAttackTypesService, getHighestCasualtyRegionsService } from "../services/dbService";

export const getDeadliestAttackTypes = async (req:Request,res:Response)=>{
    try {
     const response=  await getDeadliestAttackTypesService() 
        res.status(200).json(createResponse({response},"data loaded"))
    } catch (error) {
        res.status(500).json(createResponse({},`${error}`,false)); 
    }
}

export const getHighestCasualtyRegions = async (req:Request,res:Response)=>{
    try {
     const response=  await getHighestCasualtyRegionsService() 
        res.status(200).json(createResponse({response},"data loaded"))
    } catch (error) {
        res.status(500).json(createResponse({},`${error}`,false)); 
    }
}