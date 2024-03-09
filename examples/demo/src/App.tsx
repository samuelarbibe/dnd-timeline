import React, { } from "react";
import { Button } from "@/components/ui/button";
import TimelineWrapper from "./components/timeline/timeline-wrapper";
import Timeline from "./components/timeline/timeline";
import { ExternalLinkIcon, GitHubLogoIcon, RotateCounterClockwiseIcon } from "@radix-ui/react-icons";

function App() {
  return (
    <TimelineWrapper>
      <div className="p-10 xl:p-20 gap-10 flex flex-1 flex-col xl:flex-row items-center justify-evenly xl:justify-around">
        <div className="flex flex-col min-w-fit">
          <div className="flex w-full flex-col justify-center items-center xl:items-start gap-3">
            <h1 className="text-3xl font-bold tracking-tight lg:text-6xl">🎉&nbsp; dnd-timeline</h1>
            <span className="text-xl text-muted-foreground">
              A headless timeline library for React, based on
              <a className='text-xl font-bold px-2 hover:underline underline-offset-4' href='https://dndkit.com/' target='#'>dnd-kit</a>
            </span>
            <div className='flex flex-row items-center justify-start mt-5 gap-4'>
              <Button
                asChild
                className="relative gap-2 text-lg text-foreground hover:scale-105 transition-all drop-shadow-slate-200"
                variant='outline'
              >
                <a href='https://samuel-arbibe.gitbook.io/dnd-timeline/' target='#'>
                  <div className="absolute w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -z-10 blur-lg" />
                  <ExternalLinkIcon />
                  Documentation
                </a>
              </Button>
              <Button
                asChild
                className='text-lg gap-2 hover:scale-105 transition-all'
                variant='outline'
              >
                <a href='https://github.com/samuelarbibe/dnd-timeline' target='#'>
                  <GitHubLogoIcon />
                  Github
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex max-w-7xl flex-col w-full max-md:hidden">
          <Timeline />
        </div>
        <div className="flex flex-col items-center w-full md:hidden gap-3">
          <RotateCounterClockwiseIcon className="size-10" />
          <span className="text-xl">Rotate device to landscape</span>
        </div>
      </div >
    </TimelineWrapper >
  )
}

export default App;
