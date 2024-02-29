import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params: { reservationId } }: { params: { reservationId: string } }
): Promise<Response> {
  if (!reservationId) {
    return new Response(
      JSON.stringify({
        message: "Missing reservationId",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    await prisma.tripReservation.delete({
      where: {
        id: reservationId,
      },
    });

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting reservation" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
