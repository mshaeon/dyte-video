import { useEffect } from "react";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import { useReactiveVar } from "@apollo/client";

import { useJoinVideoMeetingMutation } from "@/api/join-video-meeting.graphql.generated";
import { VideoUi } from "./video-ui";
import { RoomState } from "@components/__new-folder-structure__/scorecard-questionnaire/types";
import { VideoMeetingStep, videoMeetingStepVar } from "./post-meeting";
import { Loader } from "@components/__new-folder-structure__/loader";

import type { GetInterviewScorecardByIdQuery } from "@components/__new-folder-structure__/scorecard/api/get-interview-scorecard-by-id.graphql.generated";

type Props = {
  interviewScorecard: GetInterviewScorecardByIdQuery["interviewScorecard"];
};

export const Video = ({ interviewScorecard }: Props) => {
  const [meeting, initMeeting] = useDyteClient();
  const videoMeetingStep = useReactiveVar(videoMeetingStepVar);

  const [
    joinVideoMeetingMutation,
    { data, loading: joinVideoMeetingMutationLoading },
  ] = useJoinVideoMeetingMutation();

  const candidateAppointmentId =
    interviewScorecard?.interviewRound?.candidateAppointment.id;
  const authToken = data?.joinVideoMeeting?.joinDetails?.authToken;

  // NOTE: This is useEffect cleanup function is in charge of leaving the meeting when the component is unmounted.
  useEffect(
    () => () => {
      meeting?.leave();
    },
    [meeting]
  );

  useEffect(() => {
    if (candidateAppointmentId) {
      joinVideoMeetingMutation({
        variables: {
          data: {
            candidateAppointmentId,
          },
        },
      });
    }

    // NOTE: Disabling rule because we want this useEffect to run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authToken) {
      initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
      });
    }

    // NOTE: Removing the initMeeting dependency because it is causing an infinite network request loop to the Dyte API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.joinVideoMeeting?.joinDetails?.authToken]);

  // NOTE: This is a temporary fix recommended by the Dyte team in order to rejoin the meeting after the user has left the meeting.
  useEffect(() => {
    if (
      authToken &&
      meeting?.self.roomState !== RoomState.Init &&
      videoMeetingStep === VideoMeetingStep.PreMeeting
    ) {
      initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
      });
    }

    // NOTE: Removing the initMeeting dependency because it is causing an infinite network request loop to the Dyte API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, meeting?.self.roomState, videoMeetingStep]);

  if (!meeting || joinVideoMeetingMutationLoading) {
    return (
      // <VideoUiWrapper> // TODO: It is not possible to wrap it in the VideoUiWrapper because it uses the provideDyteDesignSystem and it needs to be inside the DyteProvider.
      <Loader />
      // </VideoUiWrapper>
    );
  }

  return (
    <DyteProvider value={meeting}>
      <VideoUi candidateAppointmentId={candidateAppointmentId} />
    </DyteProvider>
  );
};
