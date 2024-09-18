export interface References {
  [key: string]: string;
}

export interface OrderDetailDTO {
  documentNumber: string;
  documentType: string;
  transferredValue: number;
  gmf: number;
  statusCode: number;
  message: string;
  creationDate: string;
  references: References;
}

export class NotificationPayloadDTO {
  uniqueCode: string;
  nit: string;
  orderCommerce: string;
  gmfActivo: boolean;
  successfulTransfers: number;
  failedTransfers: number;
  totalAmountTransferred: number;
  totalAmountFailed: number;
  totalGmfTransfered: number;
  totalGmfFailed: number;
  emails: string;
  creationDate: string;
  orderDetailDTOs: OrderDetailDTO[];
}
