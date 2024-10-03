// @ts-nocheck
"use client";
import { useEffect, useState } from 'react';
import { useGetCalls } from '../hooks/useGetCalls';
import { useRouter } from 'next/navigation';
import { CallRecording } from '@stream-io/node-sdk';
import { Call } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from "@/hooks/use-toast"


const CallList = ({type}:{type:'ended'|'upcoming'|'recordings'}) => {
    const {isLoading, endedCalls, upcomingCalls, callRecordings} = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);
    const {toast} = useToast();
    const router = useRouter();
    const getCalls = () => {
       switch (type) {
              case 'ended':
                return endedCalls;
              case 'upcoming':
                return upcomingCalls;
              case 'recordings':
                return recordings;
              default:
                return [];
         }
    }
    const getNoCallsMessage = () => {
        switch (type) {
               case 'ended':
                 return 'No previous Calls';
               case 'upcoming':
                 return 'No upcoming Calls';
               case 'recordings':
                 return 'No recordings';
               default:
                 return '';
          }
     }

     useEffect(() => {
      const fetchRecordings = async () => {
        try {
          const callData = await Promise.all(callRecordings?.map((meeting)=>meeting.queryRecordings()));
  
          const recordings = callData
          .filter(call=>call.recordings.length > 0)
          .flatMap(call=>call.recordings);
            setRecordings(recordings);
        } catch (error) {
          toast({title:'try again later'})
        }
      }
      if(type === 'recordings') fetchRecordings();
     },[type,callRecordings]);
     const calls = getCalls();
      const message = getNoCallsMessage();
      if(isLoading) return <Loader />
  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {
            calls && calls.length > 0 ? calls.map((meeting: Call|CallRecording) => (
                <MeetingCard
                    key={(meeting as Call)?.id}
                    icon={
                        type ==='ended'
                        ? '/icons/previous.svg'
                        : type === 'upcoming'
                        ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'

                    }
                    title={(meeting as Call).state?.custom?.description?.substring(0, 20) ||
                    meeting?.filename?.substring(0,20)|| 'Personal Meeting Room'}
                    date={(meeting as Call).state?.startsAt?.toLocaleString() || (meeting as CallRecording).start_time.toLocaleString()}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                    handleClick={type === 'recordings' ? ()=>router.push(`${meeting.url}`):()=>router.push(`/meeting/${meeting.id}`)

                    }
                    link={type==='recordings' ? meeting.url: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                     
                />
            )):(<h1 className='text-2xl font-bold'>{message}</h1>)
        }
        
    </div>
  )
}

export default CallList