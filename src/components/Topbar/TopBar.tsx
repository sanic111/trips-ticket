import React, {useEffect, useRef, forwardRef, useCallback, memo} from "react";

import DateList, {type DateListHandle} from "@/components/Topbar/DateList";
import SortOptionsGroup, { type SortOptionsGroupHandle } from "@/components/Topbar/SortOptionsGroup";
import VoucherSection from "@/components/Topbar/VoucherSection";
import FilterButtonGroup, {type FilterButtonGroupHandle} from "./FilterButtonGroup";
import TripFilterPopup, {type TripFilterPopupHandle} from "../../features/trip/components/PopUp/TripFilterPopup";
import BusOperatorPopup, {type BusOperatorPopupHandle} from "@/features/bus/BusOperatorPopup";
import ServicePopup, {type ServicePopupHandle} from "@/features/service/ServicePopup";
import Icon from "@/assets/icons/Icon";
import {PiDotsThreeOutlineFill} from "react-icons/pi";

import type {Trip} from "@/features/trip/model/trip.types";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

export type TopBarProps = {
    trips: Trip[];
    onDateChange: (date: string) => void;
};
const BackIcon = memo(() => <Icon name="back" />);
const CloseIcon = memo(() => <Icon name="close" style={{width: 40, height: 40}} />);

const DotsIcon = memo(() => <PiDotsThreeOutlineFill color="#fff" />);

function generateDateListFromTrips(trips: Trip[] = []) {
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const result: Array<{day: string; date: string}> = [];

    const raw = trips.find((trip) => !!trip.departure_date)?.departure_date;
    if (!raw) return result;

    const [day, month, year] = raw.split("-").map(Number);
    const startDate = new Date(year, month - 1, day);
    if (isNaN(startDate.getTime())) return result;

    for (let i = 0; i <= 30; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dayName = weekdays[d.getDay()];
        const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        result.push({day: dayName, date});
    }

    return result;
}

const TopBar = forwardRef<HTMLDivElement, TopBarProps>(({trips, onDateChange}, ref) => {
    const dates = generateDateListFromTrips(trips);
    const filterButtonGroupRef = useRef<FilterButtonGroupHandle>(null);
    const sortGroupRef = useRef<SortOptionsGroupHandle>(null);
    const filterPopupRef = useRef<TripFilterPopupHandle>(null);
    const operatorPopupRef = useRef<BusOperatorPopupHandle>(null);
    const servicePopupRef = useRef<ServicePopupHandle>(null);
    const dateListRef = useRef<DateListHandle>(null);

    const {t} = useTranslation();

    // Reset DateList khi trips thay đổi
    useEffect(() => {
        if (dates.length > 0) {
            dateListRef.current?.reset();
        }
    }, [dates]);

    // Chọn ngày
    const handleDateSelect = useCallback(
        (date: string) => {
            onDateChange(date);
        },
        [onDateChange]
    );

    // Nghe filter/sort events và chuyển tiếp
    useEffect(() => {
        const handleApply = (e: CustomEvent) => {
            window.dispatchEvent(new CustomEvent("trip-filter-change", {detail: e.detail}));
        };

        window.addEventListener("trip-filter-apply", handleApply as EventListener);
        window.addEventListener("operator-filter-apply", handleApply as EventListener);
        window.addEventListener("trip-sort-change", handleApply as EventListener);

        return () => {
            window.removeEventListener("trip-filter-apply", handleApply as EventListener);
            window.removeEventListener("operator-filter-apply", handleApply as EventListener);
            window.removeEventListener("trip-sort-change", handleApply as EventListener);
        };
    }, []);

    return (
        <div className="topBar" ref={ref}>
            {/* Header */}
            <div className="route">
                <div className="backIcon">
                    <BackIcon />
                </div>
                <div className="locationnclose">
                    <div>
                        <div className="pick">{t("topbar.selectTrip")}</div>
                        <div className="locationrange">{t("topbar.routeExample")}</div>
                        <LanguageSwitcher />
                    </div>
                    <div className="close">
                        <div className="leftGroup">
                            <div onClick={() => servicePopupRef.current?.open()} className="iconButton">
                                <DotsIcon />
                            </div>
                            <div className="iconButton" style={{color: "#ffffff5c", height: "5px"}}>
                                |
                            </div>
                        </div>
                        <div className="iconButton closeButton">
                            <CloseIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách ngày */}
            <DateList ref={dateListRef} dates={dates} onSelect={handleDateSelect} />

            {/* Bộ lọc & Sắp xếp - TÁCH RIÊNG */}
            <div className="filterRow">
                {/* Nhóm sắp xếp */}
                <div className="sortGroup">
                    <SortOptionsGroup ref={sortGroupRef} />
                </div>

                {/* Nhóm lọc */}
                <div className="filterGroup">
                    <FilterButtonGroup ref={filterButtonGroupRef} />
                </div>
            </div>

            {/* Voucher */}
            <VoucherSection />

            {/* Popups */}
            <TripFilterPopup ref={filterPopupRef} />
            <BusOperatorPopup ref={operatorPopupRef} />
            <ServicePopup ref={servicePopupRef} />
        </div>
    );
});

export default TopBar;
