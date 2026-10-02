'use client'
import { Badge } from "@/components/tailgrids/core/badge";

export default function Header() {
    return (
        // header container
        <>
            <div className="mt-4 text-center">
                {/* code */}
                <div className="flex justify-center gap-4">
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-red-600 text-gray-100 rotate-15">C</Badge>
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-800 text-gray-100 -rotate-15">S</Badge>
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-700 text-gray-100 rotate-15">I</Badge>
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-cyan-500 text-gray-100 -rotate-15">2</Badge>
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-500 text-gray-100 rotate-15">0</Badge>
                    <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-600 text-gray-100 -rotate-15">5</Badge>
                </div>

                {/* name */}
                <div className="mt-4">
                    <Badge className="text-2xl font-bold text-white bg-black rounded-lg py-2 px-4">FRONT END SOFTWARE DEVELOPMENT</Badge>
                </div>
            </div>
        </>
    )
}
