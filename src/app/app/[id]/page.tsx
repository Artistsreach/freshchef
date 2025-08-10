"use server";

import { getApp } from "@/actions/get-app";
import AppWrapper from "../../../components/app-wrapper";
import { freestyle } from "@/lib/freestyle";
import { db } from "@/lib/db";
import { appUsers, appsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getUser } from "@/auth/stack-auth";
import { memory } from "@/mastra/agents/builder";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/dist/client/link";
import { chatState } from "@/actions/chat-streaming";
import { CrowdfundButton } from "@/components/crowdfund-button";
// The schema is already imported via the db import

export default async function AppPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) {
  const { id } = await params;

  // Fetch the app first to determine if it's public
  const app = await getApp(id).catch(() => undefined);

  if (!app) {
    return <ProjectNotFound />;
  }

  // If the app is not public, require authentication and membership
  if (!app.info.public) {
    const user = await getUser();

    const userPermission = (
      await db
        .select()
        .from(appUsers)
        .where(and(eq(appUsers.userId, user.userId), eq(appUsers.appId, id)))
        .limit(1)
    ).at(0);

    if (!userPermission?.permissions) {
      return <ProjectNotFound />;
    }
  }

  // Determine if the current viewer is a member to conditionally show "Recreate"
  let showRecreate = false;
  try {
    const user = await getUser();
    const membership = (
      await db
        .select()
        .from(appUsers)
        .where(and(eq(appUsers.userId, user.userId), eq(appUsers.appId, id)))
        .limit(1)
    ).at(0);
    showRecreate = !membership;
  } catch {
    // Not logged in; show recreate on public apps
    showRecreate = !!app.info.public;
  }

  const { uiMessages } = await memory.query({
    threadId: id,
    resourceId: id,
  });

  const { codeServerUrl, ephemeralUrl } = await freestyle.requestDevServer({
    repoId: app?.info.gitRepo,
  });

  console.log("requested dev server");

  // Use the previewDomain from the database, or fall back to a generated domain
  const domain = app.info.previewDomain;

  // Check if the current user is the owner of the app
  const user = await getUser();
  const isOwner = user && (await db
    .select()
    .from(appUsers)
    .where(
      and(
        eq(appUsers.userId, user.userId),
        eq(appUsers.appId, id),
        eq(appUsers.permissions, 'admin')
      )
    )
  ).length > 0;

  // Get the full app data with Stripe fields
  const fullApp = await db.query.appsTable.findFirst({
    where: (appsTable, { eq }) => eq(appsTable.id, id),
  });

  // Check if the app is already monetized
  const isMonetized = fullApp?.isMonetized && fullApp.stripeProductId && fullApp.stripePriceId;

  return (
    <AppWrapper
      key={app.info.id}
      baseId={app.info.baseId}
      codeServerUrl={codeServerUrl}
      appName={app.info.name}
      initialMessages={uiMessages}
      consoleUrl={ephemeralUrl + "/__console"}
      repo={app.info.gitRepo}
      appId={app.info.id}
      repoId={app.info.gitRepo}
      domain={domain ?? undefined}
      running={(await chatState(app.info.id)).state === "running"}
      topBarActions={
        app.info.public && isOwner && !isMonetized ? (
          <CrowdfundButton 
            appId={app.info.id} 
            appName={app.info.name}
            appDescription={app.info.description}
          />
        ) : null
      }
      showRecreate={showRecreate}
      sourceAppId={app.info.id}
    />
  );
}

function ProjectNotFound() {
  return (
    <div className="text-center my-16">
      Project not found or you don&apos;t have permission to access it.
      <div className="flex justify-center mt-4">
        <Link className={buttonVariants()} href="/">
          Go back to home
        </Link>
      </div>
    </div>
  );
}
