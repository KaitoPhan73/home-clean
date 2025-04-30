export interface StaffStatus {
  id: string;
  status: string;
  fullName?: string;
  phoneNumber?: string;
  lastUpdated: string;
}

export interface StaffDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: string;
  lastUpdated: string;
  phoneNumber?: string;
  gender?: string;
  address?: string;
}

export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    transition?: {
      type?: string;
      stiffness?: number;
      staggerChildren?: number;
    };
  };
}