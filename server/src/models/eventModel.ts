// src/models/TerrorEventModel.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ITerrorEvent extends Document {
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

const TerrorEventSchema = new Schema<ITerrorEvent>({
    eventid: { type: String },
    iyear: { type: Number },
    imonth: { type: Number },
    iday: { type: Number },
    country_txt: { type: String },
    region_txt: { type: String },
    city: { type: String },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    attacktype1_txt: { type: String },
    targtype1_txt: { type: String },
    target1: { type: String },
    gname: { type: String },
    weaptype1_txt: { type: String },
    nkill: { type: Number, default: null },
    nwound: { type: Number, default: null },
    nperps: { type: Number, default: null },
    summary: { type: String, default: null }
});

// הוספת אינדקסים לשדות נפוצים
TerrorEventSchema.index({ attacktype1_txt: 1 });
TerrorEventSchema.index({ city: 1 });
TerrorEventSchema.index({ iyear: 1 });

export default mongoose.model<ITerrorEvent>("TerrorEventModel", TerrorEventSchema);
