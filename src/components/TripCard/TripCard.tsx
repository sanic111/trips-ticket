import React from "react";
import { useTranslation } from "react-i18next";
import type { Trip } from "@/features/trip/model/trip.types";
import Icon from "@/assets/icons/Icon";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useDynamicTranslation } from "@/ultils/useDynamicTranslation";
import { formatCurrency } from "@/ultils/formatCurrency";
export type TripCardProps = {
  trip: Trip;
  uuid: string;
  isFavorite: boolean;
  onToggleFavorite: (uuid: string) => void;
};

const TripCard: React.FC<TripCardProps> = React.memo(
  ({ trip, uuid, isFavorite, onToggleFavorite }) => {
    const { t, i18n } = useTranslation();
    const { translateLocation, translateOperator } = useDynamicTranslation();

    const {
      departure_time,
      drop_off_time,
      merchant_start_point_name,
      merchant_end_point_name,
      fare_amount,
      discount_amount = 0,
      vehicle_type,
      duration_in_min,
      transport_information,
    } = trip;

    const tripData = React.useMemo(() => {
      const duration = Math.ceil(duration_in_min / 60);
      const discountedPrice = fare_amount - discount_amount;
      const hasDiscount = discount_amount > 0;

      const formattedDiscounted = formatCurrency(discountedPrice, i18n.language);
      const formattedOriginal = formatCurrency(fare_amount, i18n.language);

      return {
        duration,
        discountedPrice,
        hasDiscount,
        formattedDiscounted,
        formattedOriginal,
      };
    }, [fare_amount, discount_amount, duration_in_min, i18n.language]);

    const handleToggleFavorite = React.useCallback(() => {
      onToggleFavorite(uuid);
    }, [onToggleFavorite, uuid]);

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
                    {translateOperator(transport_information.name)}
                  </div>
                  <div className="ratingnheart">
                    <span className="rating">
                      ⭐ {transport_information.rating}
                    </span>
                    <span
                      onClick={handleToggleFavorite}
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
                  <span>{vehicle_type}</span>
                </div>
              </div>
            </div>
          </header>

          <section className="timeline">
            <div className="timeBlockLeft">
              <time dateTime={departure_time}>
                <strong>{departure_time}</strong>
              </time>
              <address>{translateLocation(merchant_start_point_name)}</address>
            </div>

            <div className="rule">
              <a href="#">
                <div className="detail">{t("regulationDetails")}</div>
                <strong className="duration">
                  <MdKeyboardDoubleArrowRight className="icon" />
                  {tripData.duration}
                  {t("hours")}
                  <MdKeyboardDoubleArrowRight className="icon" />
                </strong>
              </a>
            </div>

            <div className="timeBlockRight">
              <time dateTime={drop_off_time}>
                <strong>{drop_off_time}</strong>
              </time>
              <address>{translateLocation(merchant_end_point_name)}</address>
            </div>
          </section>

          <div className="tripCardFooter">
            <div className="priceGroup">
              <span className="discountedPrice">
                {tripData.formattedDiscounted}
              </span>
              {tripData.hasDiscount && (
                <span className="originalPrice">
                  {tripData.formattedOriginal}
                </span>
              )}
            </div>
            <button className="button">{t("book")}</button>
          </div>

          <aside className="promo">
            <span>{t("promoMessage")}</span>
          </aside>
        </div>
      </article>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.trip.uuid === nextProps.trip.uuid &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.trip.fare_amount === nextProps.trip.fare_amount &&
      prevProps.trip.discount_amount === nextProps.trip.discount_amount
    );
  }
);

export default TripCard;
