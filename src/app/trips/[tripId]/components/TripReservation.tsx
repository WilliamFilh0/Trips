"use client";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/input";
import { differenceInDays } from "date-fns";
import { Trip } from "@prisma/client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface TripReservationProps {
  tripId: String;
  tripStartDate: Date;
  tripEndDate: Date;
  maxGuests: number;
  pricePerDay: number;
}

interface TripReservationForm {
  guests: number;
  startDate: Date | null;
  endDate: Date | null;
}

const TripReservation = ({
  maxGuests,
  tripStartDate,
  tripEndDate,
  pricePerDay,
  tripId,
}: TripReservationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setError,
  } = useForm<TripReservationForm>();

  const router = useRouter();

  const onSubmit = async (data: TripReservationForm) => {
    const response = await fetch("http://localhost:3000/api/trips/check", {
      method: "POST",
      body: Buffer.from(
        JSON.stringify({
          startDate: data.startDate,
          endDate: data.endDate,
          tripId,
        })
      ),
    });

    const res = await response.json();

    //console.log({ res });

    if (res?.error?.code === "TRIP_ALREADY_RESERVED") {
      setError("startDate", {
        type: "manual",
        message: "Esta data já está reservada. ",
      });
      return setError("endDate", {
        type: "manual",
        message: "Esta data já está reservada.",
      });
    }

    if (res?.error?.code === "INVALID_START_DATE") {
      return setError("startDate", {
        type: "manual",
        message: "Data Invalida. ",
      });
    }

    if (res?.error?.code === "INVALID_END_DATE") {
      return setError("endDate", {
        type: "manual",
        message: "Data Invalida. ",
      });
    }

    router.push(
      `/trips/${tripId}/confirmation?startDate=${data.startDate?.toISOString()}&endDate=${data.endDate?.toISOString()}&guests=${
        data.guests
      }`
    );
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <div className="flex flex-col px-5 pb-10 ">
      <div className="flex gap-4 ">
        <Controller
          name="startDate"
          rules={{
            required: {
              value: true,
              message: "Data inicial é obrigatória.",
            },
          }}
          control={control}
          render={({ field }) => (
            <DatePicker
              error={!!errors?.startDate}
              errorMessage={errors?.startDate?.message}
              onChange={field.onChange}
              selected={field.value}
              placeholderText="Data de Inicio"
              className="w-full"
              minDate={tripStartDate}
            />
          )}
        />

        <Controller
          name="endDate"
          rules={{
            required: {
              value: true,
              message: "Data final é obrigatória.",
            },
          }}
          control={control}
          render={({ field }) => (
            <DatePicker
              error={!!errors?.endDate}
              errorMessage={errors?.endDate?.message}
              onChange={field.onChange}
              selected={field.value}
              placeholderText="Data de Final"
              className="w-full"
              maxDate={tripEndDate}
              minDate={startDate ?? tripStartDate}
            />
          )}
        />
      </div>

      <Input
        {...register("guests", {
          required: {
            value: true,
            message: "Número de hóspedes é obrigatório.",
          },
          max: {
            value: maxGuests,
            message: `Número de hóspedes não podem ser maior que ${maxGuests}.`,
          },
        })}
        placeholder={`Numero de hospespedes (max: ${maxGuests})`}
        className="mt-4"
        error={!!errors?.guests}
        errorMessage={errors?.guests?.message}
        type="number"
      />
      <div className="flex justify-between mt-3">
        <p className="font-medium text-sm text-primaryDark">Total: </p>
        <p className="font-medium text-sm text-primaryDark">
          {startDate && endDate
            ? `R$${differenceInDays(endDate, startDate) * pricePerDay}` ?? 1
            : "R$0"}
        </p>
      </div>

      <div className="pb-10 border-b border-grayLighter w-full">
        <Button
          onClick={() => handleSubmit(onSubmit)()}
          variant="primary"
          className="mt-3 w-full"
        >
          Reservar agora
        </Button>
      </div>
    </div>
  );
};

export default TripReservation;
