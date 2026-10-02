'use client'

import Link from 'next/link'
import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Instagram, } from "@tailgrids/icons";

export default function Footer() {
    return (
        // footer container
        <div className="mt-4 text-center">
            {/* student name */}
            <div>
                <Badge className="text-3xl text-black font-bold bg-cyan-200 rounded-xl py-2 px-4">68062284 นายนัฐวิ ดวงมาลย์</Badge>
            </div>

            {/* Link contact */}
            <div className="mt-4 flex justify-center gap-4">
                    <Link href="https://www.facebook.com/kakarot1337?locale=th_TH" target="_blank">
                        <Facebook className="text-blue-700"/>
                    </Link>
                    <div className="border-l"></div>

                    <Link href="https://www.instagram.com/zen0ke/" target="_blank">
                        <Instagram className="text-pink-500"/>
                    </Link>
            </div>
        </div>
    )
}
