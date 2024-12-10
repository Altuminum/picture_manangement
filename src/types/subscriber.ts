export type Package = "Basic" | "With Frame" | "Extra Pictures" | "Complete Package";

export interface Subscriber {
  id: string;
  fullName: string;
  studentNumber: string;
  degreeProgram: string;
  pictureUrl: string;
  package: Package;
  isPaid: boolean;
  claimedAt?: Date;
  claimedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriberFormData {
  fullName: string;
  studentNumber: string;
  degreeProgram: string;
  package: Package;
  picture?: File;
}