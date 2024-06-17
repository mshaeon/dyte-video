import { useDyteSelector } from "@dytesdk/react-web-core";
import { useReactiveVar } from "@apollo/client";

import { PreMeeting } from "./pre-meeting";
import { InMeeting } from "./in-meeting";
import {
  PostMeeting,
  VideoMeetingStep,
  videoMeetingStepVar,
} from "./post-meeting";
import {
  LeaveRoomState,
  RoomState,
} from "@components/__new-folder-structure__/scorecard-questionnaire/types";

type Props = {
  candidateAppointmentId?: string;
};

export const VideoUi = ({ candidateAppointmentId }: Props) => {
  const roomState = useDyteSelector((meeting) => meeting.self.roomState);
  const videoMeetingStep = useReactiveVar(videoMeetingStepVar);

  return (
    <>
      {roomState === RoomState.Init ||
      videoMeetingStep === VideoMeetingStep.PreMeeting ? (
        <PreMeeting />
      ) : null}

      {roomState === RoomState.Joined ? <InMeeting /> : null}

      {roomState === LeaveRoomState.Ended ||
      roomState === LeaveRoomState.Left ||
      roomState === LeaveRoomState.Disconnected ||
      roomState === LeaveRoomState.Rejected ? (
        <PostMeeting candidateAppointmentId={candidateAppointmentId} />
      ) : null}
    </>
  );
};
