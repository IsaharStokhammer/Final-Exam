export type Status = "idle" | "loading" | "succeeded" | "failed";

export interface IAttackTypesPerCasualties {
  totalCasualties: number;
  attackType: string;
}

export interface IHighestCasualtyRegions {
  regionType: string;
  regionName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  averageCasualties: number;
}

export interface IIncidentTrends {
  regionType: string;
  regionName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  averageCasualties: number;
}
