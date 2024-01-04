// Neccessary imports

import React from "react";
import { service } from "../../assets/data/service.js";
import { ServiceCard } from "./ServiceCard";

export const ServiceList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] bg-red-50">
      {service.map((item, index) => (
        <ServiceCard item={item} index={index} key={index} />
      ))}
    </div>
  );
};
