import { useDyteMeeting } from "@dytesdk/react-web-core";
import { useReducer } from "react";
import { DyteGrid, DyteSidebar } from "@dytesdk/react-ui-kit";

import { VideoUiWrapper } from "./video-ui-wrapper";

export const InMeeting = () => {
  const { meeting } = useDyteMeeting();

  const [states, updateStates] = useReducer(
    (state: any, payload: any) => ({
      ...state,
      ...payload,
    }),
    { meeting: "joined", activeSidebar: false }
  );

  return (
    <div
      ref={(el) => {
        el?.addEventListener("dyteStateUpdate", (e: any) => {
          updateStates(e.detail);
        });
      }}
    >
      <VideoUiWrapper>
        <DyteGrid
          meeting={meeting}
          style={{ height: "calc(100vh - 240px)", width: "100%" }}
        />
        {states.activeSidebar && (
          <DyteSidebar
            meeting={meeting}
            states={states}
            style={{ height: "auto", margin: "16px 0" }}
          />
        )}
      </VideoUiWrapper>
    </div>
  );
};
