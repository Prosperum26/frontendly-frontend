export type ID = string;
export type Timestamp = number;

export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SelectOption {
  label: string;
  value: string;
}
