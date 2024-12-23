export interface IAttackTypesPerCasualties{
    totalCasualties:number,
    attackType:string
}
export interface IAreasWithTheHighestAverageCasualties{
    regionType: string;
    regionName: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    averageCasualties: number;
}
export interface IAttackByYear{
    totalIncidents: number,
    year: number
}