import React from 'react';

const Session = ({ session, key }) => {
    // Safe data extraction with fallbacks
    /*const sessionType = session?.type || 'No Type';
    const coachName = session?.coach ? 
        `${session.coach.first_name || ''} ${session.coach.last_name || ''}`.trim() || 
        session.coach.username || 
        'Unknown Coach' 
        : 'No Coach';
    const sessionDay = session?.day || 'No Date';
    const sessionTime = session?.time || 'No Time';
    const sessionDuration = session?.duration || 'N/A';*/

    return (
        <div key={key} className='w-full h-72 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-3xl text-center flex flex-col justify-center items-center text-white transform hover:bg-blue-800 hover:scale-105 hover:-translate-y-3 duration-500 p-4'>
            <div className='space-y-2'>
                <div className='text-2xl font-bold capitalize'>{session.type}</div>
                <div className='text-lg font-semibold capitalize'>Coach: {session.name}</div>
                <div className='text-lg font-semibold capitalize'>Day: {session.day}</div>
                <div className='text-lg font-semibold'>Time: {(session.time).slice(0,5)}</div>
                <div className='text-lg font-semibold'>Duration: {session.duration} min</div>
            </div>
        </div>
    );
};

export default Session;