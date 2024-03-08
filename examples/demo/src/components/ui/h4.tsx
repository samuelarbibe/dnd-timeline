import type { PropsWithChildren } from 'react';
import React from 'react';

export function H4(props: PropsWithChildren) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h4>
  )
}
