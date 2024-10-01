"use client"
import React from 'react'
import HomeCard from './HomeCard'
import MeetingModal from './MeetingModal'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'

const MeetingTypeList = () => {
 const [meetingState, setMeetingState] = React.useState<'isJoiningMeeting' |'isScheduleMeeting'|'isInstantMeeting'| undefined>()


 const [value, setValue] = React.useState({
   dateTime:new Date(),
   description:'',
   link:'',
 })

 const [callDetails, setCallDetails] = React.useState<Call>(
 );

 const {toast} = useToast();
 const user = useUser();
 const client = useStreamVideoClient();

    const createMeeting = async() => {
      if(!user || !client) return;
      try {
         if(!value.dateTime) {
            toast({title:'Please select a date and time'});
            return 
         }

         const id = crypto.randomUUID();
         const call = client.call('default',id);
         
         if(!call) throw new Error('failed to create call');

         const startsAt =value.dateTime.toISOString() || new Date(Date.now()).toISOString();
         const description = value.description || 'Instant Meeting';

         await call.getOrCreate({
            data:{
               starts_at:startsAt,
               custom:{
                  description,
               }
            }
         })
         setCallDetails(call);
         if(!value.description){
            router.push(`/meeting/${call.id}`);
         }
         toast({
            title:'Meeting created successfully',
         })
      } catch (error) {
         console.log(error);
         toast({
            title:'Failed to create meeting',
           
         })
      }
    }
 const router = useRouter();
  return (
   <section className='grid grid-cols-2 gap-5 md:grid-cols-2 xl:grid-cols-4 '>
       <HomeCard 
    img="/icons/add-meeting.svg"
    title="New Meeting"
    description="Start an instant meeting"
    handleClick={() => setMeetingState('isInstantMeeting')}
    className="bg-orange-1"
    />
     <HomeCard 
    img="/icons/schedule.svg"
    title="Schedule Meeting"
    description="Plan your meeting"
    handleClick={() => setMeetingState('isScheduleMeeting')}
    className="bg-blue-1"
    />
     <HomeCard 
    img="/icons/recordings.svg"
    title="View Recordings"
    description="Check your recordings"
    handleClick={() => router.push('/recordings')}
    className="bg-purple-1"
    />
     <HomeCard 
    img="/icons/join-meeting.svg"
    title="Join Meeting"
    description="Via inviataion link"
    handleClick={() => setMeetingState('isJoiningMeeting')}
    className="bg-yellow-1"
    />
    <MeetingModal
    isOpen={meetingState==='isInstantMeeting'}
    onClose={() => setMeetingState(undefined)}
    title='Start an instant meeting'
    className='text-center'
    handleClick={createMeeting}
    buttonText='Start Meeting'
    />
   </section>
  )
}

export default MeetingTypeList