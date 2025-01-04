"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import { useEffect, useRef } from "react"

const Herosection = () => {
    const imageref = useRef();
    useEffect(()=>{
        const imageElement = imageref.current;
        const handelscroll = ()=>{
            const scrollposition = window.scrollY;
            const scrollthreshold = 100;
            if(scrollposition > scrollthreshold){
                imageElement.classList.add("scrolled");

            }
            else{
                imageElement.classList.remove("scrolled");

            }
        }
        window.addEventListener("scroll",handelscroll);
        return ()=>window.removeEventListener("scroll",handelscroll);

    })
  return (
    <div className="pb-20 px-4">
        <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title ">
                Manage Your Finances <br/> with Intelligence
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                An AI-powered financial management platform that helps you track,
                analyze, and optimize your spending with real-time insights.
            </p>
            <div className="flex justify-center space-x-4">
                <Link href={"/dashboard"}>
                <Button size="lg" className="px-8">
                    Get Started
                </Button>
                </Link>

                <Link href={"https://www.youtube.com/watch?v=fa8k8IQ1_X0"}>
                <Button size="lg" variant="outline" className="px-8">
                  Watch Demo
                </Button>
                </Link>
            </div>
            <div className="hero-image-wrapper">
                <div ref={imageref} className="hero-image">
                    <Image src="/banner.jpeg" width={1280} height={720} alt="dashboard preview" priority className="rounded-lg shadow-2xl border mx-auto" />
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Herosection
