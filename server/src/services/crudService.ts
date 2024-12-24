import TerrorEventModel from "../models/eventModel";

export interface TerrorEvent {
  eventid: string;
  iyear: number;
  imonth: number;
  iday: number;
  country_txt: string;
  region_txt: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  attacktype1_txt: string;
  targtype1_txt: string;
  target1: string;
  gname: string;
  weaptype1_txt: string;
  nkill: number | null;
  nwound: number | null;
  nperps: number | null;
  summary: string | null;
}

//CREATE
export const createAttack = async (data: TerrorEvent) => {
  try {
    const event = await TerrorEventModel.create(data);
    return event;
  } catch (error) {
    throw error;
  }
};
//READ
export const getAttack = async (id: string) => {
  try {
    const event = await TerrorEventModel.findOne({ eventid: id });
    return event;
  } catch (error) {
    throw error;
  }
};
//UPDATE
export const updateAttack = async (id: string, data: TerrorEvent) => {
  try {
    const updatedEvent = await TerrorEventModel.findOneAndUpdate(
        { eventid: id },
        data,
        { new: true }
      );
      
    return updatedEvent;
  } catch (error) {
    throw error;
  }
};
//DELETE
export const deleteAttack = async (id: string) => {
  try {
    const event = await TerrorEventModel.deleteOne({ eventid: id });
    return event;
  } catch (error) {
    throw error;
  }
};
