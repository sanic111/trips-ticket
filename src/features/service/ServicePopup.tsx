import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/assets/icons/Icon";

export interface ServicePopupHandle {
  open: () => void;
  close: () => void;
}

type Props = {};

const ServicePopup = forwardRef<ServicePopupHandle, Props>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className="popup"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="ServiceHeader">
              <span>Dịch vụ</span>
              <button onClick={() => setIsOpen(false)}>
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
});

export default ServicePopup;
