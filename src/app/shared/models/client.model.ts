/**
 * Client model
 * Represents a client record in the quotation system.
 */
export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
