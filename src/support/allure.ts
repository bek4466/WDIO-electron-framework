import allureReporter from '@wdio/allure-reporter';

type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

type AllureMetadata = {
  parentSuite?: string;
  suite?: string;
  subSuite?: string;
  epic?: string;
  feature?: string;
  story?: string;
  severity?: Severity;
  owner?: string;
  tags?: string[];
  description?: string;
};

export async function annotateTest(metadata: AllureMetadata): Promise<void> {
  if (metadata.parentSuite) {
    await allureReporter.addParentSuite(metadata.parentSuite);
  }

  if (metadata.suite) {
    await allureReporter.addSuite(metadata.suite);
  }

  if (metadata.subSuite) {
    await allureReporter.addSubSuite(metadata.subSuite);
  }

  if (metadata.epic) {
    await allureReporter.addEpic(metadata.epic);
  }

  if (metadata.feature) {
    await allureReporter.addFeature(metadata.feature);
  }

  if (metadata.story) {
    await allureReporter.addStory(metadata.story);
  }

  if (metadata.severity) {
    await allureReporter.addSeverity(metadata.severity);
  }

  if (metadata.owner) {
    await allureReporter.addOwner(metadata.owner);
  }

  if (metadata.description) {
    await allureReporter.addDescription(metadata.description, 'markdown');
  }

  for (const tag of metadata.tags ?? []) {
    await allureReporter.addTag(tag);
  }
}

export async function allureStep<T>(name: string, action: () => Promise<T>): Promise<T> {
  return allureReporter.step(name, action);
}

export async function attachJson(name: string, value: unknown): Promise<void> {
  await allureReporter.addAttachment(name, JSON.stringify(value, null, 2), 'application/json');
}
