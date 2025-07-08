import React, { useState, useMemo, useCallback, useEffect } from "react";
import DateItem from "@/components/common/DateItem";
import FilterButton from "@/components/common/FilterButton";
import DiscountBadge from "@/components/common/DiscountBadge";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import {
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Icon from "@/assets/icons/Icon";
import FilterPopup from "@/features/trip/components/TripFilterPopup";
import ServicePopup from "@/features/service/ServicePopup";
import BusOperatorPopup from "@/features/bus/BusOperatorPopup";
import VoucherList from "@/components/VoucherCard/VoucherList";
import type { FilterState } from "@/types/filter.types";
import type { Trip } from "@/features/trip/model/trip.types";

// tạo ds ngày từ trip.departure_date
function generateDateListFromTrips(
  trips: Trip[] = []
): Array<{ day: string; date: string }> {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const result: Array<{ day: string; date: string }> = [];

  const raw = trips.find((trip) => !!trip.departure_date)?.departure_date;
  if (!raw) return result;

  const [day, month, year] = raw.split("-").map(Number);
  const startDate = new Date(year, month - 1, day);
  if (isNaN(startDate.getTime())) return result;

  for (let i = 0; i <= 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayName = weekdays[d.getDay()];
    const date = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
    result.push({ day: dayName, date });
  }

  return result;
}

export type TopBarProps = {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  trips: Trip[];
};

type SortField = FilterState["sortField"];

const sortOptions: { label: string; field: SortField }[] = [
  { label: "Giờ chạy", field: "departure_time" },
  { label: "Giá vé", field: "fare_amount" },
  { label: "Đánh giá", field: "rating" },
];

const TopBar: React.FC<TopBarProps> = React.memo(
  ({ filter, onFilterChange, selectedDate, onDateChange, trips }) => {
    const dates = useMemo(() => generateDateListFromTrips(trips), [trips]);

    useEffect(() => {
      if (!selectedDate && dates.length > 0) {
        onDateChange(dates[0].date);
      }
    }, [dates, selectedDate, onDateChange]);

    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [showServicePopup, setShowServicePopup] = useState(false);
    const [showOperatorPopup, setShowOperatorPopup] = useState(false);
    const [showVoucherList, setShowVoucherList] = useState(false);

    const handleDateClick = useCallback(
      (date: string) => {
        if (date !== selectedDate) {
          onDateChange(date);
        }
      },
      [selectedDate, onDateChange]
    );

    const currentSortOption = useMemo(
      () =>
        sortOptions.find((opt) => opt.field === filter.sortField) ||
        sortOptions[0],
      [filter.sortField]
    );

    const toggleSort = useCallback(
      (option: { label: string; field: SortField }) => {
        const isSameField = currentSortOption.field === option.field;
        const newDirection = isSameField
          ? filter.sortDirection === "asc"
            ? "desc"
            : "asc"
          : "asc";

        onFilterChange({
          ...filter,
          sortField: option.field,
          sortDirection: newDirection,
        });
      },
      [filter, onFilterChange, currentSortOption]
    );

    return (
      <div className="topBar">
        {/* Địa điểm */}
        <div className="route">
          <div className="backIcon">
            <Icon name="back" className="icon" />
          </div>
          <div className="locationnclose">
            <div>
              <div className="pick">Chọn chuyến đi</div>
              <div className="locationrange">Thừa Thiên Huế - Hồ Chí Minh</div>
            </div>
            <div className="close">
              <div className="leftGroup">
                <div
                  onClick={() => setShowServicePopup(true)}
                  className="iconButton"
                >
                  <PiDotsThreeOutlineFill color="#fff" />
                </div>
                <div
                  className="iconButton"
                  style={{ color: "#ffffff5c", height: "5px" }}
                >
                  |
                </div>
              </div>
              <div
                className="iconButton closeButton"
                onClick={() => {
                  /* handle close */
                }}
              >
                <Icon
                  name="close"
                  className="icon"
                  style={{ width: 40, height: 40 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thanh chọn ngày */}
        <div className="dateList">
          {dates.map((item) => (
            <DateItem
              key={item.date}
              day={item.day}
              date={item.date}
              active={selectedDate === item.date}
              onClick={() => handleDateClick(item.date)}
            />
          ))}
        </div>

        {/* Bộ lọc và sắp xếp */}
        <div className="filterRow">
          <div className="filterGroup">
            {sortOptions.map((opt) => (
              <FilterButton
                key={opt.field}
                label={opt.label}
                active={currentSortOption.field === opt.field}
                onClick={() => toggleSort(opt)}
                icon={
                  currentSortOption.field === opt.field ? (
                    filter.sortDirection === "asc" ? (
                      <FaLongArrowAltUp />
                    ) : (
                      <FaLongArrowAltDown />
                    )
                  ) : null
                }
              />
            ))}
          </div>
          <div className="filterAction">
            <FilterButton
              label="Lọc"
              onClick={() => setShowFilterPopup(true)}
              className="fullWidthButton"
              icon={<Icon name="filter" className="icon filterIcon" />}
            />
          </div>
        </div>

        {/* Mã giảm giá + link */}
        <div className="discountRow">
          <div className="discode">
            <span className="distext">Mã giảm giá của tôi</span>
            <DiscountBadge code="XEKHACH100" />
          </div>
          <div className="morenicon">
            <button
              className="seeMore"
              onClick={() => setShowVoucherList((prev) => !prev)}
            >
              {showVoucherList ? "Thu gọn" : "Xem thêm"}
            </button>
            {showVoucherList ? (
              <FaChevronUp color="#1e4894" />
            ) : (
              <FaChevronDown color="#1e4894" />
            )}
          </div>
        </div>

        {/* Voucher List */}
        <VoucherList isOpen={showVoucherList} />

        {/* Popups */}
        <FilterPopup
          isOpen={showFilterPopup}
          onClose={() => setShowFilterPopup(false)}
          onOpenOperatorPopup={() => setShowOperatorPopup(true)}
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <BusOperatorPopup
          isOpen={showOperatorPopup}
          onClose={() => setShowOperatorPopup(false)}
          onDone={() => setShowFilterPopup(true)}
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <ServicePopup
          isOpen={showServicePopup}
          onClose={() => setShowServicePopup(false)}
        />
      </div>
    );
  }
);

export default TopBar;
