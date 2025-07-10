type UserData = {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  name: string;
  updatedAt: string;
  publicMetadata: PublicMetadata;
};

type PublicMetadata = {
  instituteId: string;
  roleName: string;
  permissions: string[];
};

export type { UserData, PublicMetadata };
