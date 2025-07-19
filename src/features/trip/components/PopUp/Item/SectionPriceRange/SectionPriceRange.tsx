  import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
  } from "react";
  import SliderView, { type SliderViewHandle } from "./SliderView";
  import PriceLabelView, { type PriceLabelViewHandle } from "./PriceLabelView";
  import { PRICE_RANGE_LIMIT } from "@/features/trip/model/filter.constants";

  export interface SectionPriceRangeHandle {
    getState: () => [number, number];
    setState: (range: [number, number]) => void;
    reset: () => void;
  }

  const SectionPriceRange = forwardRef<SectionPriceRangeHandle>((_, ref) => {
    const sliderRef = useRef<SliderViewHandle>(null);
    const labelRef = useRef<PriceLabelViewHandle>(null);

    useImperativeHandle(ref, () => ({
      getState: () => sliderRef.current?.getState() ?? PRICE_RANGE_LIMIT,
      setState: (range) => {
        sliderRef.current?.setState(range);
        labelRef.current?.setState(range);
      },
      reset: () => {
        sliderRef.current?.reset();
        labelRef.current?.reset();
      },
    }));

    return (
      <div className="section">
        <div className="sectionHeader"><h4>Khoảng giá</h4></div>
        <SliderView ref={sliderRef} onChange={(range) => {
          labelRef.current?.setState(range);
        }} />
        <PriceLabelView ref={labelRef} />
      </div>
    );
  });

  export default SectionPriceRange;
