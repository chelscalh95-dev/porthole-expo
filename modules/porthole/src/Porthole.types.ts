// ── Events ──

export type PortholeModuleEvents = {
  onNewPackage: (params: PackageSummary) => void;
};

// ── Package summary (emitted on every new package) ──

export type PackageType = 'http' | 'websocket';

export type PackageSummary = {
  id: string;
  url: string;
  method: string;
  statusCode?: number;
  packageType: PackageType;
  startAt: number;
  endAt?: number;
  hasError: boolean;
};

// ── Full package (fetched on demand) ──

export type Header = {
  key: string;
  value: string;
};

export type RequestData = {
  url: string;
  method: string;
  headers: Header[];
  body?: string; // base64
};

export type ResponseData = {
  statusCode: number;
  headers: Header[];
};

export type CustomError = {
  code: number;
  message: string;
};

export type WebsocketMessageType =
  | 'pingPong'
  | 'send'
  | 'receive'
  | 'sendCloseMessage';

export type WebsocketMessage = {
  createdAt: number;
  messageType: WebsocketMessageType;
  stringValue?: string;
  dataValue?: string; // base64
};

export type Transaction = {
  id: string;
  startAt: number;
  endAt?: number;
  packageType: PackageType;
  request: RequestData;
  response?: ResponseData;
  error?: CustomError;
  responseBody?: string; // base64
  websocketMessages: WebsocketMessage[];
};