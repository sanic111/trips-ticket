import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Icon from "@/assets/icons/Icon";

export interface OperatorItemHandle {
  get: () => boolean;
  set: (v: boolean) => void;
}

interface Props {
  name: string;
  image?: string;
  translatedName: string;
}

const BusOperatorItem = forwardRef<OperatorItemHandle, Props>(
  ({ name, image, translatedName }, ref) => {
    const selectedRef = useRef(false);
    const [, setRender] = useState(0);
    const forceUpdate = () => setRender((r) => r + 1);

    const toggle = () => {
      selectedRef.current = !selectedRef.current;
      forceUpdate();
    };

    useImperativeHandle(ref, () => ({
      get: () => selectedRef.current,
      set: (v) => {
        selectedRef.current = v;
        forceUpdate();
      },
    }));

    return (
      <div className="item" onClick={toggle}>
        {image && <img src={image} alt={name} />}
        <span>{translatedName}</span>
        <Icon
          name={selectedRef.current ? "selected" : "select"}
          className="selectIcon"
        />
      </div>
    );
  }
);

export default BusOperatorItem;
