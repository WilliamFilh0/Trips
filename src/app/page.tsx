"use client";

import QuickSearch from "./components/QuickSearcyh";
import TripSearch from "./components/TripSearch";

export default function Home() {
  return (
    <div>
      <TripSearch />
      <QuickSearch />
    </div>
  );
}
