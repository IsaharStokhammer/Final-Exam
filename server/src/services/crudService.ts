import TerrorEventModel from "../models/eventModel";

export interface TerrorEvent {
  eventid: number;
  iyear: number;
  imonth: number;
  iday: number;
  country_txt: string;
  region_txt: string;
  city: string;
  latitude: number;
  longitude: number;
  attacktype1_txt: string;
  targtype1_txt: string;
  target1: string;
  gname: string;
  weaptype1_txt: string;
  nkill: number;
  nwound: number;
  nperps: number;
  summary: string;
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
export const updateAttack = async (eventId: string, event: TerrorEvent) => {
    try {
      const updatedEvent = await TerrorEventModel.findOneAndUpdate(
        { eventid: eventId }, 
        { $set: event },   
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
