export interface Trip {
  uuid: string;
  name: string;
  departure_time: string;
  pick_up_time: string;
  pick_up_date: string;
  drop_off_date: string;
  drop_off_time: string;
  fare_amount: number;
  merchant_name: string;
  vehicle_name: string;
  available_seat: number;
  vehicle_type: string;
  seat_type: string;
  total_seat: number;
  duration_in_min: number;
  merchant_start_point_name: string;
  merchant_end_point_name: string;
  merchant_trip_code: string;
  merchant_code: string;
  start_point: string;
  end_point: string;
  start_location_id: number;
  end_location_id: number;
  refund_able: boolean;
  allow_picking_seat: boolean;

  // Bổ sung các trường bị thiếu:
  status: string;
  discount_amount: number;
  search_request_id: number;
  merchant_id: number;
  departure_date: string;
  priority: number;

  transport_information: {
    name: string;
    rating: number;
    image_url: string;
    comment_number: number;
    allow_view_detail: boolean;
    id: number;
    code: string;
    is_favorite: boolean;
    direct_connect: boolean;
    notification: {
      label: string;
      description: string;
    };
  };
}
