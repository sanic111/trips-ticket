import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/assets/icons/Icon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ServicePopup = ({ isOpen, onClose }: Props) => {
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
            <div className="ServiceHeader">
              <span>Bộ lọc</span>
              <button onClick={onClose}>
                <Icon name="close" className="closeIcon" />
              </button>
            </div>

            <div className="content">
              <p>Đây là nội dung popup dịch vụ</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServicePopup;
