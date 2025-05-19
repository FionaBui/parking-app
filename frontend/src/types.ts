export type Spot = {
    id: number;
    location: string;
    start_time: string;
    end_time: string;
    price: number;
    is_available: boolean;
    is_rented: boolean;
  };
  
  export type Rental = {
    id: number;
    spot_id: number;
    location: string;
    price: number;
    rent_time: string;
  };

  export type SpotStatus = {
    spot_id: string;
  is_registered: boolean;
  is_available: boolean;
  is_rented: boolean;
  renter_id: number | null;
  is_owner: boolean;
  start_time: string | null;
  end_time: string | null;
  price: number;
  }
  
 