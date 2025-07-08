import React from "react";
import type { Trip } from "@/features/trip/model/trip.types";
import Icon from "@/assets/icons/Icon";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export type TripCardProps = {
  trip: Trip;
  uuid: string;
  isFavorite: boolean;
  onToggleFavorite: (uuid: string) => void;
};

const TripCard: React.FC<TripCardProps> = React.memo(
  ({ trip, uuid, isFavorite, onToggleFavorite }) => {
    const {
      departure_time,
      drop_off_time,
      merchant_start_point_name,
      merchant_end_point_name,
      fare_amount,
      discount_amount = 0,
      seat_type,
      duration_in_min,
      transport_information,
    } = trip;

    const duration = Math.ceil(duration_in_min / 60);
    const discountedPrice = fare_amount - discount_amount;
    const hasDiscount = discount_amount > 0;
    const formattedDiscounted = discountedPrice.toLocaleString("vi-VN");
    const formattedOriginal = fare_amount.toLocaleString("vi-VN");

    return (
      <article className="tripCard">
        <div className="info">
          <header className="tripCardHeader">
            <div className="logo">
              <div className="imageWrapper">
                <img
                  src={transport_information.image_url}
                  alt={transport_information.name}
                  className="image"
                />
              </div>
              <div className="textBlock">
                <div className="nameRow">
                  <div className="name">
                    {transport_information.name}
                  </div>
                  <div className="ratingnheart">
                    <span className="rating">
                      ⭐ {transport_information.rating}
                    </span>
                    <span
                      onClick={() => onToggleFavorite(uuid)}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        name={isFavorite ? "heartSelected" : "heart"}
                        className="heartIcon"
                      />
                    </span>
                  </div>
                </div>
                <div className="meta">
                  <span>{seat_type}</span>
                </div>
              </div>
            </div>
          </header>

          <section className="timeline">
            <div className="timeBlockLeft">
              <time dateTime={departure_time}>
                <strong>{departure_time}</strong>
              </time>
              <address>{merchant_start_point_name}</address>
            </div>

            <div className="rule">
              <a href="#">
                <div className="detail">Chi tiết quy định</div>
                <strong className="duration">
                  <MdKeyboardDoubleArrowRight className="icon" />
                  {duration}g
                  <MdKeyboardDoubleArrowRight className="icon" />
                </strong>
              </a>
            </div>

            <div className="timeBlockRight">
              <time dateTime={drop_off_time}>
                <strong>{drop_off_time}</strong>
              </time>
              <address>{merchant_end_point_name}</address>
            </div>
          </section>

          <div className="tripCardFooter">
            <div className="priceGroup">
              <span className="discountedPrice">
                {formattedDiscounted}₫
              </span>
              {hasDiscount && (
                <span className="originalPrice">
                  {formattedOriginal}₫
                </span>
              )}
            </div>
            <button className="button">Đặt vé</button>
          </div>

          <aside className="promo">
            <span>Tặng mã 50K gọi Taxi/Bike</span>
          </aside>
        </div>
      </article>
    );
  }
);

export default TripCard;
