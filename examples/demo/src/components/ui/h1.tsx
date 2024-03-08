import type { PropsWithChildren } from 'react';
import React from 'react';

export function H1(props: PropsWithChildren) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {props.children}
    </h1>
  )
}
