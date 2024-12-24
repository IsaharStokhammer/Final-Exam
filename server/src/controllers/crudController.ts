import { Request, Response } from "express";
import {
  createAttack,
  deleteAttack,
  getAttack,
  TerrorEvent,
  updateAttack,
} from "../services/crudService";
import { createResponse } from "../utils/utils";

const requiredFields = [
  "eventid",
  "iyear",
  "imonth",
  "iday",
  "country_txt",
  "region_txt",
  "city",
  "latitude",
  "longitude",
  "attacktype1_txt",
  "targtype1_txt",
  "target1",
  "gname",
  "weaptype1_txt",
  "nkill",
  "nwound",
  "nperps",
  "summary",
];

//CREATE
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: " + missingFields.join(", "),
      });
      return;
    }

    const newAttack: TerrorEvent = req.body;
    const response = await createAttack(newAttack);
    res.status(200).json(createResponse({ response }, "Data saved"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

//READ
export const read = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json(createResponse({}, "Missing id", false));
      return;
    }
    const response = await getAttack(id);
    if (!response) {
      res.status(404).json(createResponse({}, "Attack not found", false));
      return;
    }
    res.status(200).json(createResponse({ response }, "Data loaded"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

//UPDATE
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const id = req.body.id;
    if (!id) {
      res.status(400).json(createResponse({}, "Missing id", false));
      return;
    }
    const data = req.body.data;
    if (!data) {
      res.status(400).json(createResponse({}, "Missing data", false));
      return;
    }

    const missingFields = requiredFields.filter((field) => !(field in data));

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: " + missingFields.join(", "),
      });
      return;
    }

    const prevVersion = await getAttack(id);
    if (!prevVersion) {
      res.status(404).json(createResponse({}, "Not found", false));
      return;
    }

    const response = await updateAttack(id, data);
    res.status(200).json(createResponse({ response }, "Data updated"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};

//DELETE
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json(createResponse({}, "Missing id", false));
      return;
    }
    const response = await getAttack(id);
    if (!response) {
      res.status(404).json(createResponse({}, "Not found", false));
      return;
    }
    await deleteAttack(id);
    res.status(200).json(createResponse({ response }, "Data deleted"));
  } catch (error) {
    res.status(500).json(createResponse({}, `${error}`, false));
  }
};
