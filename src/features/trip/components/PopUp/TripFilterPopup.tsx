import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rawData from "@/data/locchuyenxe.json";
import SectionOperators, { type SectionOperatorsHandle } from "./Item/SectionOperators";
import SectionVehicleTypes, { type SectionVehicleTypesHandle } from "./Item/SectionVehicleTypes";
import SectionDepartureTimes, { type SectionDepartureTimesHandle } from "./Item/SectionDepartureTimes";
import SectionPriceRange, { type SectionPriceRangeHandle } from "./Item/SectionPriceRange/SectionPriceRange";
import BusOperatorPopup, { type BusOperatorPopupHandle } from "@/features/bus/BusOperatorPopup";
import { IoClose } from "react-icons/io5";
import type { Trip } from "@/features/trip/model/trip.types";
import type { FilterState } from "@/types/filter.types";
import { PRICE_RANGE_LIMIT } from "@/features/trip/model/filter.constants";
import { useTranslation } from "react-i18next"; 
const CloseIcon = () => <IoClose />;
const TRIPS: Trip[] = rawData.json.coreData.data;

const DEFAULT_FILTER: FilterState = {
  operators: [],
  vehicleTypes: [],
  departureTimes: [],
  priceRange: PRICE_RANGE_LIMIT,
  sortField: "departure_time",
  sortDirection: "asc",
};

export interface TripFilterPopupHandle {
  open: () => void;
  close: () => void;
  setInitialFilter: (filter: FilterState) => void;
}

const TripFilterPopup = forwardRef<TripFilterPopupHandle>((_, ref) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterState>(DEFAULT_FILTER);

  const operatorRef = useRef<SectionOperatorsHandle>(null);
  const typesRef = useRef<SectionVehicleTypesHandle>(null);
  const timesRef = useRef<SectionDepartureTimesHandle>(null);
  const priceRef = useRef<SectionPriceRangeHandle>(null);
  const busOperatorPopupRef = useRef<BusOperatorPopupHandle>(null);

  useEffect(() => {
    if (!isOpen) return;
    const restored = { ...currentFilter };
    operatorRef.current?.setState(restored.operators);
    typesRef.current?.setState(restored.vehicleTypes);
    timesRef.current?.setState(restored.departureTimes);
    priceRef.current?.setState(restored.priceRange ?? PRICE_RANGE_LIMIT);
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    },
    close: () => handleClose(),
    setInitialFilter: (filter) => {
      setCurrentFilter(filter);
    },
  }));

  const handleReset = () => {
    const resetFilter = DEFAULT_FILTER;
    setCurrentFilter(resetFilter);
    operatorRef.current?.reset();
    typesRef.current?.reset();
    timesRef.current?.reset();
    priceRef.current?.reset();
    window.dispatchEvent(new CustomEvent("trip-filter-apply", { detail: resetFilter }));
  };

  const handleApply = () => {
    const newFilter: FilterState = {
      operators: operatorRef.current?.getState() ?? [],
      vehicleTypes: typesRef.current?.getState() ?? [],
      departureTimes: timesRef.current?.getState() ?? [],
      priceRange: priceRef.current?.getState() ?? PRICE_RANGE_LIMIT,
      sortField: currentFilter.sortField,
      sortDirection: currentFilter.sortDirection,
    };
    setCurrentFilter(newFilter);
    window.dispatchEvent(new CustomEvent("trip-filter-apply", { detail: newFilter }));
    setIsOpen(false);
  };

  const handleClose = () => {
    const tempFilter: FilterState = {
      operators: operatorRef.current?.getState() ?? [],
      vehicleTypes: typesRef.current?.getState() ?? [],
      departureTimes: timesRef.current?.getState() ?? [],
      priceRange: priceRef.current?.getState() ?? PRICE_RANGE_LIMIT,
      sortField: currentFilter.sortField,
      sortDirection: currentFilter.sortDirection,
    };
    setCurrentFilter(tempFilter);
    setIsOpen(false);
  };

  const handleShowAll = () => {
    busOperatorPopupRef.current?.setInitialFilter({
      ...currentFilter,
      operators: operatorRef.current?.getState() ?? [],
    });
    busOperatorPopupRef.current?.open();
  };

  useEffect(() => {
    const handleOperatorApply = (e: Event) => {
      const custom = e as CustomEvent<FilterState>;
      const updatedOps = custom.detail.operators ?? [];
      operatorRef.current?.setState(updatedOps);
      const temp = { ...currentFilter, operators: updatedOps };
      setCurrentFilter(temp);
    };
    window.addEventListener("operator-filter-apply", handleOperatorApply);
    return () => window.removeEventListener("operator-filter-apply", handleOperatorApply);
  }, [currentFilter]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <motion.div
              className="popup"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="tripFilterHeader">
                <span style={{ marginBottom: "8px" }}>{t("filter.title")}</span>
                <button onClick={handleClose}>
                  <CloseIcon />
                </button>
              </div>

              <div className="sectionHeader">
                <h4>{t("filter.operators")}</h4>
                <button onClick={handleShowAll}>{t("filter.viewAll")}</button>
              </div>

              <SectionOperators ref={operatorRef} trips={TRIPS} />
              <SectionVehicleTypes ref={typesRef} />
              <SectionDepartureTimes ref={timesRef} />
              <SectionPriceRange ref={priceRef} />

              <div className="tripFilterFooter">
                <div className="tripFilterButton">
                  <button className="clearBtn" onClick={handleReset}>
                    {t("filter.clear")}
                  </button>
                  <button className="applyBtn" onClick={handleApply}>
                    {t("filter.apply")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BusOperatorPopup ref={busOperatorPopupRef} />
    </>
  );
});

export default TripFilterPopup;
