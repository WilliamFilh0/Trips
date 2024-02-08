import { Trip } from "@prisma/client";
import Image from "next/image";
import React from "react";
import ReactCountryFlag from "react-country-flag";

interface TripItemProps {
  trip: Trip;
}

const TripItem = ({ trip }: TripItemProps) => {
  return (
    <div className="flex flex-col">
      <Image
        src={trip.coverImage}
        width={280}
        height={280}
        className="rounded-lg shadow-md"
        alt={trip.name}
      />

      <h3 className="text-primaryDark font-medium text-sm mt-2">{trip.name}</h3>

      <div className="flex items-center gap-1 my-1">
        <ReactCountryFlag countryCode={trip.countryCode} svg />
        <p className="text-xs text-grayPrimary">{trip.location}</p>
      </div>
      <p className="text-xs text-grayPrimary">
        <span className="text-primary font-medium">
          R${trip.pricePerDay.toString()}
        </span>{" "}
        por dia
      </p>
    </div>
  );
};

export default TripItem;
