export type Representations = {
  _id: string;
  Name: string;
  Default: boolean;
  RecordStatusType_ReferenceId: string;
  id: string;
};

export type RepresentationsResponseData = {
  message: string;
  total: number;
  data: Representations[];
};

export type RepresentationsResponse = {
  response: RepresentationsResponseData;
  status: 200;
};

export type FetchRepresentationsResponse = RepresentationsResponse | undefined;
