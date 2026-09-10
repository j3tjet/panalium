export type UserRole = "buyer" | "wholesaler" | "admin";

export interface Wallet {
  usdt: number;
  bs: number;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  wallet: Wallet;
  createdAt: string;
  verified: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  wholesalerId: string;
  wholesalerName: string;
  name: string;
  description: string;
  unitPrice: number;
  currency: "USDT" | "BS";
  minUnits: number;
  image: string;
  category: string;
  available: boolean;
  createdAt: string;
}

export type GroupType = "local" | "international";
export type GroupStatus = "open" | "funded" | "paid_to_supplier" | "closed" | "cancelled";

// ERC-1155 receipt token minted when a group's payment is sent to the supplier.
// tokenId = groupId. Each holder has `amount` units of the product coming.
export interface ERC1155Token {
  id: string;            // unique holding record id
  tokenId: string;       // maps to groupId
  groupId: string;
  groupName: string;
  productImage: string;
  ownerId: string;
  amount: number;        // units of product this receipt covers
  mintedAt: string;
  status: "held" | "listed" | "burned";
  supplierETA: string;   // estimated arrival date
}

export type NFTListingStatus = "active" | "sold" | "cancelled";

export interface NFTListing {
  id: string;
  tokenId: string;
  groupId: string;
  groupName: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  amount: number;        // units being sold
  askPrice: number;      // per unit
  askCurrency: "USDT" | "BS";
  listingStatus: NFTListingStatus;
  createdAt: string;
  supplierETA: string;
}

export interface GroupMember {
  userId: string;
  userName: string;
  units: number;
  paid: number;
  currency: "USDT" | "BS";
  joinedAt: string;
}

export interface BuyingGroup {
  id: string;
  type: GroupType;
  creatorId: string;
  creatorName: string;
  productName: string;
  description?: string;
  productId?: string;
  productLink?: string;
  imageUrl?: string;
  targetUnits: number;
  currentUnits: number;
  unitPrice: number;
  currency: "USDT" | "BS";
  entryDeposit: number;
  minUnits: number;
  members: GroupMember[];
  status: GroupStatus;
  category?: string;
  createdAt: string;
  deadline?: string;
}

export type View =
  | "auth"
  | "dashboard"
  | "wallet"
  | "marketplace-products"
  | "marketplace-groups"
  | "my-groups"
  | "create-group"
  | "create-intl-group"
  | "group-detail"
  | "wholesaler-products"
  | "wholesaler-add-product"
  | "admin-users"
  | "admin-overview"
  | "my-receipts"
  | "nft-marketplace";
