import React, { } from "react";
import { H1 } from "@/components/ui/h1";
import { H4 } from "@/components/ui/h4";
import { Button } from "@/components/ui/button";
import TimelineWrapper from "./components/timeline/timeline-wrapper";
import Timeline from "./components/timeline/timeline";

function App() {
  return (
    <div className="container mx-auto flex items-center justify-center h-full flex-col gap-3">
      <H1>dnd-timeline</H1>
      <H4>
        A headless timeline library for React, based on
        <Button
          className="px-2 text-md font-bold"
          onClick={() => window.open('https://dndkit.com/')}
          variant='link'
        >
          dnd-kit
        </Button>
      </H4>
      <Button
        className="text-lg text-foreground bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        onClick={() => { window.open('https://samuel-arbibe.gitbook.io/dnd-timeline/') }}
      >
        Documentation
      </Button>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full mt-5 p-5">
        <TimelineWrapper>
          <Timeline />
        </TimelineWrapper>
      </div>
    </div>
  )
}

export default App;
