"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import ReactCountryFlag from "react-country-flag";
import ptBR from "date-fns/locale/pt-BR";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";

import { Trip } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const TripConfirmation = ({ params }: { params: { tripId: string } }) => {
  const [trip, setTrip] = useState<Trip | null>();
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();

  const { status, data } = useSession();

  console.log(data?.user);

  const SearchParams = useSearchParams();

  useEffect(() => {
    const fetchTrip = async () => {
      const response = await fetch(`/api/trips/check`, {
        method: "POST",
        body: JSON.stringify({
          tripId: params.tripId,
          startDate: SearchParams.get("startDate"),
          endDate: SearchParams.get("endDate"),
        }),
      });

      const res = await response.json();

      if (res?.error) {
        return router.push("/");
      }

      setTrip(res.trip);
      setTotalPrice(res.totalPrice);
    };

    if (status === "unauthenticated") {
      router.push("/");
    }

    fetchTrip();
  }, [status, SearchParams, params, router]);

  if (!trip) return null;

  const handleBuyClick = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: Buffer.from(
        JSON.stringify({
          tripId: params.tripId,
          startDate: SearchParams.get("startDate"),
          endDate: SearchParams.get("endDate"),
          guests: Number(SearchParams.get("guests")),
          userId: (data?.user as any)?.id,
          totalPrice,
          coverImage: trip.coverImage,
          name: trip.name,
          description: trip.description,
        })
      ),
    });

    if (!res.ok) {
      return toast.error("Ocorreu um erro ao realizar a reserva!", {
        position: "bottom-center",
      });
    }

    const { sessionId } = await res.json();

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_KEY as string
    );

    await stripe?.redirectToCheckout({ sessionId });

    toast.success("Reserva concluida com sucesso! ", {
      position: "bottom-center",
    });
  };

  const startDate = new Date(SearchParams.get("startDate") as string);
  const endDate = new Date(SearchParams.get("endDate") as string);
  const guests = SearchParams.get("guests");

  return (
    <div className="container mx-auto p-5">
      <h1 className="font-semibold text-xl text-primaryDark">Sua viagem</h1>

      {/*CARD*/}
      <div className="flex flex-col p-5 mt-5 border-grayLighter border-solid border shadow-lg rounded-lg">
        <div className="flex items-center gap-3 pb-5 border-b border-grayLighter border-solid">
          <div className="relative h-[106px] w-[124px] ">
            <Image
              src={trip.coverImage}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              alt={trip.name}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl text-primaryDark font-semibold ">
              {trip.name}
            </h2>

            <div className="flex items-center gap-1 ">
              <ReactCountryFlag countryCode={trip.countryCode} svg />
              <p className="text-xs text-grayPrimary">{trip.location}</p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-primaryDark mt-3">
          Informações sobre o preço
        </h3>

        <div className="flex justify-between mt-1">
          <p className=" text-primaryDark ">Total: </p>
          <p className="font-medium">R${totalPrice}</p>
        </div>
      </div>

      <div className="flex flex-col mt-5 text-primaryDark">
        <h3 className="font-semibold">Data</h3>
        <div className="flex items-center gap-1 mt-1">
          <p>{format(startDate, "dd 'de' MMMM", { locale: ptBR })}</p>
          {" - "}
          <p>{format(endDate, "dd 'de' MMMM", { locale: ptBR })}</p>
        </div>

        <h3 className="font-semibold mt-5">Hóspedes</h3>
        <p>{guests} hóspedes</p>

        <Button className="mt-5" onClick={handleBuyClick}>
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
};

export default TripConfirmation;
