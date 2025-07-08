import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/assets/icons/Icon";
import rawData from "@/data/locchuyenxe.json";
import type { Trip } from "@/features/trip/model/trip.types";
import type { FilterState } from "@/types/filter.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
};

const TRIPS: Trip[] = rawData.json.coreData.data;

export default function BusOperatorPopup({
  isOpen,
  onClose,
  onDone,
  filter,
  onFilterChange,
}: Props) {
  const selectedCount = filter.operators.length;

  const operators = Array.from(
    new Set(TRIPS.map((t) => t.transport_information.name))
  );

  const toggleOperator = (name: string) => {
    const newOperators = filter.operators.includes(name)
      ? filter.operators.filter((o) => o !== name)
      : [...filter.operators, name];

    onFilterChange({ ...filter, operators: newOperators });
  };

  const handleDone = () => {
    onClose();
    onDone();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="popup"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="busHouseheader">
              <span>Chọn nhà xe</span>
              <button onClick={onClose}>
                <Icon name="close" className="closeIcon" />
              </button>
            </div>

            <div className="list">
              {operators.map((name) => {
                const operator = TRIPS.find(
                  (t) => t.transport_information.name === name
                )?.transport_information;

                const selected = filter.operators.includes(name);

                return (
                  <div
                    key={name}
                    className="item"
                    onClick={() => toggleOperator(name)}
                  >
                    <img src={operator?.image_url} alt={name} />
                    <span>{name}</span>
                    <Icon
                      name={selected ? "selected" : "select"}
                      className="selectIcon"
                    />
                  </div>
                );
              })}
            </div>

            <div className="busHouseFooter">
              <button className="doneBtn" onClick={handleDone}>
                Áp dụng {selectedCount > 0 ? `(${selectedCount})` : ""}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
