import { Mastra } from "@mastra/core";
import { builderAgent } from './agents/builder';

export const mastra = new Mastra({
  agents: { builderAgent },
});
