export type SpotStatus = {
  spot_id: number;
  spot_number: string;
  is_available: boolean;
  is_rented: boolean;
  renter_id: number | null;
  is_owner: boolean;
  start_time: string | null;
  end_time: string | null;
  price: number;
}

export type ProfileData = {
  user_id: number;
  total_rentals: number;
  rentals: {
    id: number;
    spot_id: number;
    rent_date: string;
    rent_start_time: string;
    rent_end_time: string;
    location: string;
    price: number;
  }[];
  owner_spot: {
    id: number;
    location: string;
    owner_id: number;
  } | null;
}
  
 