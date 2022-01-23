import { Prisma } from "@prisma/client";
import _ from "lodash";

const credentialData = Prisma.validator<Prisma.CredentialArgs>()({
  select: { id: true, type: true },
});

type CredentialData = Prisma.CredentialGetPayload<typeof credentialData>;

export type Integration = {
  installed: boolean;
  type:
    | "google_calendar"
    | "office365_calendar"
    | "zoom_video"
    | "daily_video"
    | "caldav_calendar"
    | "apple_calendar"
    | "exchange_calendar"
    | "stripe_payment";
  title: string;
  imageSrc: string;
  description: string;
  variant: "calendar" | "conferencing" | "payment";
};

export const ALL_INTEGRATIONS = [
  {
    installed: false,
    type: "google_calendar",
    title: "Google Calendar",
    imageSrc: "integrations/google-calendar.svg",
    description: "For personal and business calendars",
    variant: "calendar",
  },
  {
    installed: false,
    type: "office365_calendar",
    title: "Office 365 / Outlook.com Calendar",
    imageSrc: "integrations/outlook.svg",
    description: "For personal and business calendars",
    variant: "calendar",
  },
  {
    installed: false,
    type: "zoom_video",
    title: "Zoom",
    imageSrc: "integrations/zoom.svg",
    description: "Video Conferencing",
    variant: "conferencing",
  },
  {
    installed: false,
    type: "daily_video",
    title: "Daily.co Video",
    imageSrc: "integrations/daily.svg",
    description: "Video Conferencing",
    variant: "conferencing",
  },
  {
    installed: false,
    type: "caldav_calendar",
    title: "CalDav Server",
    imageSrc: "integrations/caldav.svg",
    description: "For personal and business calendars",
    variant: "calendar",
  },
  {
    installed: false,
    type: "apple_calendar",
    title: "Apple Calendar",
    imageSrc: "integrations/apple-calendar.svg",
    description: "For personal and business calendars",
    variant: "calendar",
  },
  {
    installed: true,
    type: "exchange_calendar",
    title: "Exchange Calendar",
    imageSrc: "integrations/outlook.svg",
    description: "For personal and business calendars",
    variant: "calendar",
  },
  {
    installed: false,
    type: "stripe_payment",
    title: "Stripe",
    imageSrc: "integrations/stripe.svg",
    description: "Collect payments",
    variant: "payment",
  },
] as Integration[];

function getIntegrations(userCredentials: CredentialData[]) {
  const integrations = ALL_INTEGRATIONS.map((integration) => {
    const credentials = userCredentials
      .filter((credential) => credential.type === integration.type)
      .map((credential) => _.pick(credential, ["id", "type"])); // ensure we don't leak `key` to frontend

    const credential: typeof credentials[number] | null = credentials[0] || null;
    return {
      ...integration,
      /**
       * @deprecated use `credentials`
       */
      credential,
      credentials,
    };
  });

  return integrations;
}

export type IntegrationMeta = ReturnType<typeof getIntegrations>;

export function hasIntegration(integrations: IntegrationMeta, type: string): boolean {
  return !!integrations.find(
    (i) => i.type === type && !!i.installed && (type === "daily_video" || i.credentials.length > 0)
  );
}
export function hasIntegrationInstalled(type: Integration["type"]): boolean {
  return ALL_INTEGRATIONS.some((i) => i.type === type && !!i.installed);
}

export default getIntegrations;
