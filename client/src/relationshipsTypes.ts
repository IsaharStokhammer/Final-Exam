
export interface IOrganizationsByArea {
    latitude: number,
    longitude: number,
    totalEvents: number,
    name: string
}
export interface IOrganizationByYear{
    year?:number,
    groupName?: string,
    totalIncidents: number
}
export interface IAllYearsOrgName{
    year: number,
    totalIncidents: number
}
export interface ITopRegionsForOrg{
    topOrg: string,
    totalCasualties: number,
    latitude: number,
    longitude: number,
    region: string
}
