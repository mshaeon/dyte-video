import { Box, HStack, VStack } from "@chakra-ui/react";
import {
  DyteSettingsToggle,
  DyteMicToggle,
  DyteCameraToggle,
  DyteLeaveButton,
  DyteScreenShareToggle,
  // DyteChatToggle,
  provideDyteDesignSystem,
  DyteDialogManager,
  DyteNotifications,
  DyteParticipantsAudio,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";
import { useEffect, useRef } from "react";

import { DisableToggle } from "./disable-toggle";
import {
  LeaveRoomState,
  RoomState,
} from "@components/__new-folder-structure__/scorecard-questionnaire/types";

enum Toggles {
  Settings = "settings",
  Mic = "mic",
  Camera = "camera",
  ScreenShare = "screenShare",
  Chat = "chat",
  Leave = "leave",
}

const getDisabledToggles = (roomState: RoomState | LeaveRoomState) => {
  switch (roomState) {
    case RoomState.Init:
      return {
        [Toggles.Settings]: false,
        [Toggles.Mic]: false,
        [Toggles.Camera]: false,
        [Toggles.ScreenShare]: true,
        [Toggles.Chat]: true,
        [Toggles.Leave]: true,
      };
    case RoomState.Joined:
      return {
        [Toggles.Settings]: false,
        [Toggles.Mic]: false,
        [Toggles.Camera]: false,
        [Toggles.ScreenShare]: false,
        [Toggles.Chat]: false,
        [Toggles.Leave]: false,
      };
    case LeaveRoomState.Ended:
    case LeaveRoomState.Left:
    case LeaveRoomState.Disconnected:
    case LeaveRoomState.Rejected:
      return {
        [Toggles.Settings]: false,
        [Toggles.Mic]: true,
        [Toggles.Camera]: true,
        [Toggles.ScreenShare]: true,
        [Toggles.Chat]: true,
        [Toggles.Leave]: true,
      };
    default:
      return {
        [Toggles.Settings]: false,
        [Toggles.Mic]: false,
        [Toggles.Camera]: false,
        [Toggles.ScreenShare]: false,
        [Toggles.Chat]: false,
        [Toggles.Leave]: false,
      };
  }
};

type Props = {
  children: React.ReactNode;
};

export const VideoUiWrapper = ({ children }: Props) => {
  const meetingEl = useRef(null);
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    if (meetingEl.current) {
      provideDyteDesignSystem(meetingEl.current, {
        googleFont: "Inter",
        theme: "light",
        colors: {
          // background: {
          //   1000: "#F1F0F7",
          // },
          danger: "#7D35FF",
          brand: {
            300: "7B4FF6",
            400: "7B4FF6",
            500: "#5250d7",
            600: "5b26f3",
            700: "430cd9",
          },
          text: "#071428",
          "text-on-brand": "#ffffff",
          "video-bg": "#E5E7EB",
        },
        borderRadius: "rounded",
      });
    }
  }, []);

  /**
   * Using meeting.self.roomState directly instead of:
   * const roomState = useDyteSelector((meeting) => meeting.self.roomState);
   *
   * Since this roomState would have outdated data when rerunning initMeeting
   * again in:
   * src/components/__new-folder-structure__/scorecard-questionnaire/components/body/left-content/video/index.tsx
   */
  const disabledToggles = getDisabledToggles(
    meeting.self.roomState as RoomState | LeaveRoomState
  );

  return (
    <VStack height="100%" ref={meetingEl} spacing={0}>
      <Box
        display="flex"
        flex="1"
        width="100%"
        backgroundColor="#eef1f7"
        position="relative"
        justifyContent="center"
      >
        {children}
      </Box>
      <HStack as="footer" justifyContent="space-between" py={8} width="100%">
        <DisableToggle isDisabled={disabledToggles[Toggles.Settings]}>
          <DyteSettingsToggle className="dissable-toggle" size="sm" />
        </DisableToggle>
        <HStack>
          <DisableToggle isDisabled={disabledToggles[Toggles.Mic]}>
            <DyteMicToggle
              className="dissable-toggle"
              meeting={meeting}
              size="sm"
            />
          </DisableToggle>
          <DisableToggle isDisabled={disabledToggles[Toggles.Camera]}>
            <DyteCameraToggle
              className="dissable-toggle"
              meeting={meeting}
              size="sm"
            />
          </DisableToggle>
          <DisableToggle isDisabled={disabledToggles[Toggles.Leave]}>
            <DyteLeaveButton className="dissable-toggle" size="sm" />
          </DisableToggle>
        </HStack>
        <HStack>
          <DisableToggle isDisabled={disabledToggles[Toggles.ScreenShare]}>
            <DyteScreenShareToggle
              className="dissable-toggle"
              meeting={meeting}
              size="sm"
            />
          </DisableToggle>
          {/* Disabling Chat button for now until we resolve the textarea issue not being clickable, working currently with the Dyte team. */}
          {/* <DisableToggle isDisabled={disabledToggles[Toggles.Chat]}>
            <DyteChatToggle
              className="dissable-toggle"
              meeting={meeting}
              size="sm"
            />
          </DisableToggle> */}
        </HStack>
      </HStack>
      <DyteParticipantsAudio meeting={meeting} />
      <DyteNotifications meeting={meeting} />
      <DyteDialogManager meeting={meeting} />
    </VStack>
  );
};
