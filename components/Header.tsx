"use client";
import { Badge } from "@/components/tailgrids/core/badge";
import { useGlobalData } from "@/app/context/GlobalData";

export default function Header() {
  const { user } = useGlobalData();

  return (
    // header container
    <>
      <div className="mt-4 text-center">
        {/* code */}
        <div className="flex justify-center gap-4">
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-red-600 text-gray-100 rotate-15">
            C
          </Badge>
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-800 text-gray-100 -rotate-15">
            S
          </Badge>
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-700 text-gray-100 rotate-15">
            I
          </Badge>
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-cyan-500 text-gray-100 -rotate-15">
            2
          </Badge>
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-500 text-gray-100 rotate-15">
            0
          </Badge>
          <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-600 text-gray-100 -rotate-15">
            5
          </Badge>
        </div>

        {/* name */}
        <div className="mt-4">
          <Badge className="text-2xl font-bold text-white bg-black rounded-lg py-2 px-4">
            FRONT END SOFTWARE DEVELOPMENT
          </Badge>
        </div>

        {/* logged-in user */}
        {user && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg">
            <span className="font-bold">
              ROLE:{" "}
              <span className="rounded-md bg-red-50 px-2 text-red-700">{user.role}</span>
            </span>
            <span className="font-bold">
              NAME:{" "}
              <span className="rounded-md bg-green-50 px-2 text-green-700">{user.name}</span>
            </span>
            <span className="font-bold">
              EMAIL:{" "}
              <span className="rounded-md bg-gray-100 px-2 font-normal text-gray-800">{user.email}</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
