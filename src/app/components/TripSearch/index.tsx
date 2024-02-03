"use client";

import DatePicker from "@/components/DatePicker";
import Input from "@/components/input";
import React from "react";
import CurrencyInput from "@/components/CurrencyInput";

const TripSearch = () => {
  return (
    <div className="container mx-auto ">
      <h1 className="font-semibold text-2xl text-primaryDark text-center">
        Encontre sua próxima <span className="text-primary">viagem!</span>
      </h1>

      <div className="flex flex-col gap-4 nt-5">
        <Input placeholder="Onde você quer ir? " />

        <div className="flex gap-4 ">
          <DatePicker
            placeholderText="Data de ida"
            onChange={() => {}}
            className="w-full"
          />
          <CurrencyInput placeholder="Orçamento" />
        </div>
      </div>
    </div>
  );
};

export default TripSearch;
