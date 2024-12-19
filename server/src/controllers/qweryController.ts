import express, { Request, Response } from "express";
import { createResponse } from "../utils/utils";
import {
  getDeadliestAttackTypesService,
  getGroupsByYearService,
  getHighestCasualtyRegionsService,
  getTopGroupsByRegionService,
  getTopGroupsService,
  getTrendsForYearsService,
  getYearsByGroupService,
} from "../services/dbService";

export const getDeadliestAttackTypes = async (req: Request, res: Response) => {
  try {
    const response = await getDeadliestAttackTypesService();
    res.status(200).json(createResponse({ response }, "data loaded"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

export const getHighestCasualtyRegions = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await getHighestCasualtyRegionsService();
    res.status(200).json(createResponse({ response }, "data loaded"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

export const getTrendsForYears = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startYear, endYear } = req.params;
    const start = parseInt(startYear, 10);
    const end = parseInt(endYear, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      res.status(400).json(createResponse({}, "Invalid year range", false));
    }

    const trends = await getTrendsForYearsService(start, end);

    res.status(200).json(createResponse({ data: trends }, "Data loaded"));
  } catch (error) {
    console.error("Error in getTrendsForYears:", error);
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

export const getTopGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { region } = req.params;
    const { limit } = req.query;

    const response = await getTopGroupsByRegionService(region);
    if (limit) {
      response.splice(Number(limit));
    }
    res.status(200).json(createResponse({ response }, "You got the good data"));
  } catch (error) {
    res.status(500).json(createResponse({}, `Server error: ${error}`, false));
  }
};

export const getGroupsByYear = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { year } = req.params;
    const { group } = req.query;
    console.log(group);

    if (!group) {
      const response = await getGroupsByYearService(parseInt(year));
      res.status(200).json(createResponse({ data: response }, "Data loaded"));
    } else {
      const groups = await getYearsByGroupService(group as string);
      res.status(200).json(createResponse({ data: groups }, "Data loaded"));
    }
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};
