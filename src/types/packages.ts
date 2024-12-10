export type PackageType = "Basic Package" | "With Frame" | "With Extra Shots" | "Both Frame and Extra Shots";

export interface PackageOption {
  id: PackageType;
  label: string;
  price: number;
  description: string;
}

export const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: "Basic Package",
    label: "Basic Package",
    price: 500,
    description: "Basic graduation photo package",
  },
  {
    id: "With Frame",
    label: "With Frame",
    price: 900, // 500 + 400
    description: "Basic package with a frame",
  },
  {
    id: "With Extra Shots",
    label: "With Extra Shots",
    price: 650, // 500 + 150
    description: "Basic package with extra shots",
  },
  {
    id: "Both Frame and Extra Shots",
    label: "Both Frame and Extra Shots",
    price: 1050, // 500 + 550
    description: "Complete package with frame and extra shots",
  },
];

export const getPackagePrice = (packageType: PackageType): number => {
  return PACKAGE_OPTIONS.find(opt => opt.id === packageType)?.price || 0;
};