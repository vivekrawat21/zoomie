import React, { ReactNode } from 'react'
import StreamVideoProvider from '../../../providers/StreamClientProvider'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Zoomie",
  description: "Video calling made easy",
  icons:{
    icon: "/icons/logo.svg",
  }
};
const RootLayout = ({children}: {children:ReactNode}) => {
  return (
    <main>
        <StreamVideoProvider>
        {children}
        </StreamVideoProvider>
        
    </main>
  )
}

export default RootLayout