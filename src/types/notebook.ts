export type Notebook = {
  id: number,
  code: number,
  model: string 
  brand: {name: string},
  system: {name: string},
  system_version: string,
  processor_brand: string,
  processor_model: string,
  clock: number,
  hd: number | null,
  ssd: number | null,
  ram: number,
  ddr: number,
  resolution: string,
  touch: boolean,
  note: string,
  photos: [{path: string}]
}
