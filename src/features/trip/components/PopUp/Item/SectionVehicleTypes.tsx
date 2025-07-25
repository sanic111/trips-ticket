import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { VEHICLE_TYPES } from "@/features/trip/model/filter.constants";
import { useTranslation } from "react-i18next";

export interface SectionVehicleTypesHandle {
  getState: () => string[];
  setState: (s: string[]) => void;
  reset: () => void;
}

interface ItemHandle {
  get: () => boolean;
  set: (v: boolean) => void;
}

const VehicleTypeItem = forwardRef(
  ({ type }: { type: string }, ref: React.Ref<ItemHandle>) => {
    const [render, setRender] = useState(0);
    const selectedRef = useRef(false);

    const toggle = () => {
      selectedRef.current = !selectedRef.current;
      setRender((r) => r + 1);
    };

    useImperativeHandle(ref, () => ({
      get: () => selectedRef.current,
      set: (v) => {
        selectedRef.current = v;
        setRender((r) => r + 1);
      },
    }));

    return (
      <button onClick={toggle} className={selectedRef.current ? "selected" : ""}>
        {type}
      </button>
    );
  }
);

const SectionVehicleTypes = forwardRef<SectionVehicleTypesHandle>((_, ref) => {
  const { t } = useTranslation();
  const refs = useRef<Record<string, React.RefObject<ItemHandle | null>>>({});

  VEHICLE_TYPES.forEach((type) => {
    if (!refs.current[type]) {
      refs.current[type] = React.createRef();
    }
  });

  useImperativeHandle(ref, () => ({
    getState: () =>
      VEHICLE_TYPES.filter((type) => refs.current[type]?.current?.get()),
    setState: (types) => {
      VEHICLE_TYPES.forEach((type) =>
        refs.current[type]?.current?.set(types.includes(type))
      );
    },
    reset: () => {
      VEHICLE_TYPES.forEach((type) => refs.current[type]?.current?.set(false));
    },
  }));

  return (
    <div className="section">
      <div className="sectionHeader">
        <h4>{t("filter.vehicleTypes")}</h4>
      </div>
      <div className="typeOptions">
        {VEHICLE_TYPES.map((type) => (
          <VehicleTypeItem key={type} ref={refs.current[type]} type={type} />
        ))}
      </div>
    </div>
  );
});

export default SectionVehicleTypes;
