import Link from 'next/link'
import React from 'react'

function Pagew() {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='w-full max-w-lg rounded-md flex flex-col bg-blue-300 p-8 gap-2 items-center justify-center'>
        <h1>Made with Love and Blood by <a href="https://www.github.com/sujas-aggarwal">Sujas</a></h1>
        <Link href={"/monaco-editor"} className='bg-black rounded-lg text-white w-min whitespace-nowrap p-2'>Start Coding - 1</Link>
        <Link href={"/codemirror-editor"} className='bg-black rounded-lg text-white w-min whitespace-nowrap p-2'>Start Coding - 2</Link>
      </div>
    </div>
  )
}

export default Pagew
