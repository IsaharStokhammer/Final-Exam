import express, { Request, Response } from "express";
import { createResponse } from "../utils/utils";
import { getDeadliestAttackTypesService } from "../services/dbService";

export const getDeadliestAttackTypes = async (req:Request,res:Response)=>{
    try {
     const response=  await getDeadliestAttackTypesService() 
        res.status(200).json(createResponse({response},"you gat the good data"))
    } catch (error) {
        res.status(500).json(createResponse({},`${error}`,false)); 
    }
}