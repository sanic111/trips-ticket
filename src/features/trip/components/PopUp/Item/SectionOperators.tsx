import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import type { Trip } from "@/features/trip/model/trip.types";
import Icon from "@/assets/icons/Icon";
import { useDynamicTranslation } from "@/ultils/useDynamicTranslation"; // Thêm import này

export interface SectionOperatorsHandle {
  getState: () => string[];
  setState: (s: string[]) => void;
  reset: () => void;
}

type Props = {
  trips: Trip[];
};

const OperatorItem = forwardRef(
  (
    {
      name,
      image,
      translatedName, // Thêm prop này
    }: {
      name: string;
      image?: string;
      translatedName?: string; // Thêm prop này
    },
    ref: React.Ref<{ get: () => boolean; set: (val: boolean) => void }>
  ) => {
    const selectedRef = useRef(false);
    const forceUpdate = useRef<() => void>(() => {});

    const [, setRerender] = React.useState(0);
    forceUpdate.current = () => setRerender((r) => r + 1);

    useImperativeHandle(ref, () => ({
      get: () => selectedRef.current,
      set: (val) => {
        selectedRef.current = val;
        forceUpdate.current();
      },
    }));

    const toggle = useCallback(() => {
      selectedRef.current = !selectedRef.current;
      forceUpdate.current();
    }, []);

    return (
      <div className="busItem" onClick={toggle}>
        <img src={image} alt={name} />
        <span>{translatedName || name}</span> {/* Sử dụng translatedName nếu có */}
        <Icon
          name={selectedRef.current ? "selected" : "select"}
          className="selectIcon"
        />
      </div>
    );
  }
);

const SectionOperators = forwardRef<SectionOperatorsHandle, Props>(
  ({ trips }, ref) => {
    const { translateOperator } = useDynamicTranslation(); // Thêm hook translation
    
    const uniqueNames = Array.from(
      new Set(trips.map((t) => t.transport_information.name))
    );
    const refs = useRef<{ [key: string]: React.RefObject<any> }>({});

    uniqueNames.forEach((name) => {
      if (!refs.current[name]) refs.current[name] = React.createRef();
    });

    useImperativeHandle(ref, () => ({
      getState: () =>
        Object.entries(refs.current)
          .filter(([, r]) => r.current?.get())
          .map(([name]) => name),

      setState: (names) => {
        Object.entries(refs.current).forEach(([key, ref]) =>
          ref.current?.set(names.includes(key))
        );
      },

      reset: () => {
        Object.values(refs.current).forEach((r) => r.current?.set(false));
      },
    }));

    return (
      <div className="section">
        <div className="busList">
          {uniqueNames.slice(0, 3).map((name) => {
            const info = trips.find(
              (t) => t.transport_information.name === name
            )?.transport_information;
            
            const translatedName = translateOperator(name); // Thêm translation
            
            return (
              <OperatorItem
                key={name}
                ref={refs.current[name]}
                name={name}
                image={info?.image_url}
                translatedName={translatedName} // Truyền translatedName
              />
            );
          })}
        </div>
      </div>
    );
  }
);

export default SectionOperators;