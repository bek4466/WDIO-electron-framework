import { annotateTest, allureStep, attachJson } from './allure.js';

type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export type JsonFlowMetadata = {
  suite?: string;
  epic?: string;
  feature?: string;
  story?: string;
  severity?: Severity;
  owner?: string;
  tags?: string[];
  description?: string;
  links?: Array<{
    name: string;
    url: string;
    type?: string;
  }>;
};

export type JsonFlowStep<TAction extends string = string> = {
  name: string;
  action: TAction;
  expected?: unknown;
  input?: unknown;
};

export type JsonFlowTest<TAction extends string = string> = {
  id: string;
  title: string;
  metadata: JsonFlowMetadata;
  data?: Record<string, unknown>;
  steps: Array<JsonFlowStep<TAction>>;
};

export type JsonFlowFile<TAction extends string = string> = {
  suiteName: string;
  tests: Array<JsonFlowTest<TAction>>;
};

export type JsonFlowStepHandler<TAction extends string = string> = (
  step: JsonFlowStep<TAction>,
  testCase: JsonFlowTest<TAction>,
) => Promise<void>;

type JsonFlowHandlers<TAction extends string = string> = Record<
  TAction,
  JsonFlowStepHandler<TAction>
>;

export async function runJsonFlowTest<TAction extends string>(
  testCase: JsonFlowTest<TAction>,
  handlers: JsonFlowHandlers<TAction>,
): Promise<void> {
  await annotateTest({
    ...testCase.metadata,
    tags: [...(testCase.metadata.tags ?? []), testCase.id],
  });
  await attachJson('JSON test case', testCase);

  for (const step of testCase.steps) {
    const handler = handlers[step.action];

    if (!handler) {
      throw new Error(`No JSON step handler registered for action: ${step.action}`);
    }

    await allureStep(step.name, () => handler(step, testCase));
  }
}
