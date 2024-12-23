# TREC Team Queue

TREC Team Queue is a dynamic dual-interface React application designed to increase the efficiency of team rotations within the Purdue indoor pickup soccer facility turf recreational (TREC) building. 

As a regular participant in the facility, I noticed a significant lack of structure when it came to rotating teams. This often led to constant arguments, confusion, and time inefficiency, detracting from the overall experience. I designed TREC Team Queue to streamline team management, reduce conflicts, and create a more enjoyable and efficient environment for everyone involved.

## Features

- **Dynamic Team Rotation**: Users can specify the outcome of each game on the 'control' screen to reorder the teams accordingly.
- **Add/Remove Teams**: Users can add and remove teams, each associaed with a four digit passcode for added security.
- **Win Streak Tracker**: Displays the current win streak of the dominant team with a fire icon and the streak number, updates with a subtle animation. 
- **Dual Interfaces**:
  - **TV Display**: Optimized for a mounted TV in the facility, providing a clear and engaging view of the queue and win streaks.
  - **iPad Interface**: Used at the check-in desk to manage the queue and communicate updates in real time to the TV display.
- **Real-Time Updates**: The iPad and TV interfaces are synchronized, ensuring that any updates made on the iPad are instantly reflected on the TV.
- **Responsive Design**: Both interfaces are optimized for their respective devices, ensuring usability and clarity.
- **Backend with Supabase**: Secure and scalable backend for storing team information and managing queue data.

## Technology Stack

- **React**: Frontend framework for building user interfaces.
- **TypeScript**: Enhances JavaScript with type definitions to improve code quality and reduce bugs.
- **CSS**: Custom styling for responsive and polished UI.
- **Vercel**: For hosting and deploying the application.
- **Supabase**: Backend solution for managing team and queue information with real-time database capabilities.

## Live Demo

Visit the live hosted project at [nextjs-trecqueue.vercel.app](https://nextjs-trecqueue.vercel.app).

- **TV Display**: The default view shows the TV display interface.
- **Control Page**: Add `/control` to the URL to access the iPad check-in interface:
  [nextjs-trecqueue.vercel.app/control](https://nextjs-trecqueue.vercel.app/control).
