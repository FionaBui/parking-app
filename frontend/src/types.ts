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
  
 