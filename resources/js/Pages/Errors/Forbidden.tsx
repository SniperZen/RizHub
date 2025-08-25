import React from "react";
import { Link } from "@inertiajs/react";

export default function Forbidden() {
  return (
    <div className="flex flex-row items-center justify-around">
        <div className="flex flex-col items-start justify-center min-h-screen bg-white text-center px-6">
            <h1 className="font-inter font-black text-[128px] leading-[69px] text-black text-shadow-custom mb-10">FORBIDDEN</h1>

            <div className="bg-[#FE0000] border-[4px] border-[#282725] shadow-[-10px_16px_0px_#282725] font-inter not-italic font-black text-[128px] leading-[69px] text-[#F4F2EC] px-10 py-10 shadow-lg mb-6">
                403
            </div>

            <p className="text-xl text-black mb-6">
                You don’t have permission to access this resource.
            </p>

            <Link
                href="/?login=1"
                className="bg-red-600 text-white px-6 py-3 font-bold shadow-md hover:bg-red-700 transition"
            >
                &laquo; BACK TO HOME PAGE
            </Link>
        </div>
      <div className="mt-10">
        <img
          src={'/Img/Errors/forbidden.png'}
          alt="Forbidden"
          className="w-[500px]"
        />
      </div>
    </div>
  );
}
