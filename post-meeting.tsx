import { useEffect } from "react";
import { Box, Button, Container, Flex, VStack, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/pro-solid-svg-icons";
import { makeVar } from "@apollo/client";

import { useKeycloak } from "@providers/keycloak/use-keycloak";
import { useJoinVideoMeetingMutation } from "@/api/join-video-meeting.graphql.generated";
import { getTypeformUrl } from "@utils/get-typeform-url";
import { CircleWithIcon } from "@components/__new-folder-structure__/circle-with-icon";
import { Loader } from "@components/__new-folder-structure__/loader";

export enum VideoMeetingStep {
  PreMeeting = "PRE-MEETING",
}

export const videoMeetingStepVar = makeVar<VideoMeetingStep | null>(null);

type Props = {
  candidateAppointmentId?: string;
};

export const PostMeeting = ({ candidateAppointmentId }: Props) => {
  const { keycloak } = useKeycloak();

  const [
    joinVideoMeetingMutation,
    {
      data: joinVideoMeetingMutationData,
      loading: joinVideoMeetingMutationLoading,
    },
  ] = useJoinVideoMeetingMutation();

  const typeFormUrl = getTypeformUrl(keycloak, joinVideoMeetingMutationData);

  useEffect(() => {
    if (candidateAppointmentId) {
      joinVideoMeetingMutation({
        variables: { data: { candidateAppointmentId } },
      });
    }

    // NOTE: Disabling rule because we want this useEffect only to run on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (joinVideoMeetingMutationLoading) {
    return <Loader />;
  }

  return (
    <VStack align="stretch" height="100vh" bg="background.meetingBg">
      <Flex direction="column" alignItems="center">
        <Box textStyle="heading-04-semibold" mt={40}>
          You left the meeting
        </Box>
        <Container px={[7, 0]} maxW="container.sm">
          <Container
            px="8"
            py="10"
            mt={12}
            borderRadius="lg"
            backgroundColor="background.meetingCardBg"
            maxW="container.sm"
          >
            <VStack spacing="6" direction="column" alignItems="center">
              <Box>
                <CircleWithIcon
                  variant="information"
                  sx={{
                    width: "24",
                    height: "24",
                    backgroundColor: "information.500",
                    color: "information.100",
                    border: "2px solid",
                    borderColor: "information.100",
                    fontSize: "4xl",
                    marginBottom: "4",
                  }}
                >
                  <FontAwesomeIcon icon={faUsers} />
                </CircleWithIcon>
              </Box>
              <Box textStyle="paragraphy-02-semibold" fontWeight="600">
                Remember to submit your questionnaire for&nbsp;
                {
                  joinVideoMeetingMutationData?.joinVideoMeeting?.candidate
                    .fullName
                }
                .
              </Box>
            </VStack>
          </Container>
        </Container>
        <Button
          onClick={() => {
            videoMeetingStepVar(VideoMeetingStep.PreMeeting);
          }}
          mt={10}
          size="lg"
        >
          Rejoin meeting
        </Button>
        <Link color="primary.200" my={5} href={typeFormUrl} isExternal>
          How was your experience?
        </Link>
      </Flex>
    </VStack>
  );
};
