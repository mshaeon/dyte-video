import { useDyteMeeting } from "@dytesdk/react-web-core";
import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
  DyteSpinner,
} from "@dytesdk/react-ui-kit";
import { useState } from "react";
import { HStack, VStack, Box, Button } from "@chakra-ui/react";
import { useReactiveVar } from "@apollo/client";

import { VideoUiWrapper } from "./video-ui-wrapper";
import { VideoMeetingStep, videoMeetingStepVar } from "./post-meeting";
import { RoomState } from "@components/__new-folder-structure__/scorecard-questionnaire/types";

export const PreMeeting = () => {
  const { meeting } = useDyteMeeting();
  const [isLoading, setIsLoading] = useState(false);
  const videoMeetingStep = useReactiveVar(videoMeetingStepVar);

  const handleJoin = async () => {
    setIsLoading(true);
    await meeting.join();
    setIsLoading(false);
    videoMeetingStepVar(null);
  };

  const isRoomStateInit = meeting.self.roomState === RoomState.Init;

  return (
    <VideoUiWrapper>
      <VStack justifyContent="center" alignItems="center">
        <DyteParticipantTile
          meeting={meeting}
          participant={meeting.self}
          style={{ height: "300px" }}
        >
          <DyteAvatar participant={meeting.self} />
          <DyteNameTag participant={meeting.self}>
            <DyteAudioVisualizer participant={meeting.self} slot="start" />
          </DyteNameTag>
        </DyteParticipantTile>
        <VStack pt={8}>
          <Box>Joining as</Box>
          <Box textStyle="heading-05-semibold">{meeting.self.name}</Box>
        </VStack>
        <Button
          isDisabled={!isRoomStateInit || isLoading}
          onClick={handleJoin}
          style={{ width: "75%" }}
        >
          {!isRoomStateInit &&
          videoMeetingStep === VideoMeetingStep.PreMeeting ? (
            <HStack>
              <Box>Connecting...</Box>
              <DyteSpinner />
            </HStack>
          ) : null}

          {isRoomStateInit && isLoading ? (
            <HStack>
              <Box>Joining...</Box>
              <DyteSpinner />
            </HStack>
          ) : null}

          {isRoomStateInit && !isLoading ? <>Join</> : null}
        </Button>
      </VStack>
    </VideoUiWrapper>
  );
};
