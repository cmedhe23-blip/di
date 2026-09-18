import { createFileRoute } from "@tanstack/react-router";
import { BirthdayJourney } from "@/components/birthday/BirthdayJourney";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Cosmic Birthday Journey for Di" },
      { name: "description", content: "A magical, interactive birthday story created with love for Di." },
      { property: "og:title", content: "A Cosmic Birthday Journey for Di" },
      { property: "og:description", content: "Step into a dreamy garden of memories, wishes, and birthday magic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ErrorBoundary>
      <BirthdayJourney />
    </ErrorBoundary>
  );
}
