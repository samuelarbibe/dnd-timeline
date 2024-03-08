import type { PropsWithChildren } from 'react';
import React from 'react'

export function Large(props: PropsWithChildren) {
  return <div className="text-lg font-semibold">{props.children}</div>
}
