'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <div className="mx-auto mt-5 flex max-w-5xl gap-4 rounded border border-gray-300 p-3">
      <div className="w-64 shrink-0 rounded border border-gray-300">
        <Image
          src="/home/me.png"
          alt="Profile Image"
          width={256}
          height={256}
          className="h-auto w-full rounded"
        />
        <div className="p-3 text-sm">
          <b>Nuttavi Duangmal</b>, 22 years old
          <br />
          Student ID: <b>68062284</b>
          <br />
          <b>Major:</b> Computer Science and Software Development
          <br /> 
          Sripatum University (<b>SPU</b>)
        </div>
      </div>
      <div className="text-justify">
        <p>
          <b>About Me</b> I am a Computer Science and Software Development student at Sripatum University. Here are my skills and experiences:
        </p>

        <ul className="my-3 list-disc space-y-2 pl-6">
          <li>
            <b>Web Development</b> I can build websites with HTML, CSS, JavaScript.
          </li>
          <li>
            <b>Modern Front-End Stack:</b> I am comfortable working with React, TypeScript, Tailwind CSS, Node.js and Next.js.
          </li>
          <li>
            <b>Game Server Experience</b> I have hands-on experience building and running a GTA (FiveM) game server using Lua.
          </li>
          <li>
            <b>Music:</b> I play the guitar very well, and it is my favorite hobby outside of coding.
          </li>
        </ul>

        <p><b>Thank you for visiting my page!</b></p>
      </div>
    </div>
  )
}
