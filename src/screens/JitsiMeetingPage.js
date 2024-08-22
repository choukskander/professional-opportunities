import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
//import NavBarParticipant from "../../../components/componentsFront/NavBarParticipant";
import { useLocation } from 'react-router-dom';

const JitsiMeetingPage = () => {
    const location = useLocation();
    const { userName, roomName } = location.state; // Assuming the state is passed when navigating
    const domain = "meet.jit.si";

    return (
        <>
            {/* <NavBarParticipant /> */}
            <div style={{ height: "75vh", display: "grid", flexDirection: "column" }}>
                <JitsiMeeting
                    domain={domain}
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: true,
                        enableEmailInStats: false,
                    }}
                    userInfo={{ displayName: userName }}
                    containerStyles={{ display: "flex", flex: 1 }}
                />
            </div>
        </>
    );
};

export default JitsiMeetingPage;
