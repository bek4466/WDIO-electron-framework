# Architecture and Flow Diagrams

This page contains Mermaid diagrams for Confluence. If Mermaid rendering is not available, export the diagrams as images and attach them to the page.

## Framework Architecture

```mermaid
flowchart LR
  subgraph TestLayer["Test Layer"]
    Specs["Mocha Specs"]
    TestData["Test Data"]
    Screens["Screen Objects"]
    BaseScreen["BaseScreen"]
    Support["Support Helpers"]
  end

  subgraph RunnerLayer["Runner and Configuration"]
    WDIO["WDIO Runner"]
    ElectronConfig["Electron Config"]
    ReportingConfig["Reporting Config"]
    AllureHelper["Allure Helper"]
  end

  subgraph AutomationLayer["Automation Layer"]
    ElectronService["wdio-electron-service"]
    ChromeDriver["ChromeDriver"]
    ElectronApp["Electron 41 App"]
  end

  subgraph Outputs["Generated Outputs"]
    AllureResults["reports/allure-results"]
    AllureReport["reports/allure-report"]
    Screenshots["reports/screenshots"]
  end

  Specs --> TestData
  Specs --> Screens
  Specs --> AllureHelper
  Screens --> BaseScreen
  BaseScreen --> Support
  Specs --> WDIO
  WDIO --> ElectronConfig
  WDIO --> ReportingConfig
  WDIO --> ElectronService
  ElectronService --> ChromeDriver
  ChromeDriver --> ElectronApp
  AllureHelper --> AllureResults
  ReportingConfig --> AllureResults
  ReportingConfig --> Screenshots
  WDIO --> AllureResults
  AllureResults --> AllureReport
```

## Test Execution Sequence

```mermaid
sequenceDiagram
  autonumber
  participant Engineer as Automation Engineer
  participant Yarn as Yarn Script
  participant WDIO as WDIO Runner
  participant Service as Electron Service
  participant Driver as ChromeDriver
  participant App as Electron App
  participant Spec as Spec and Screen Objects
  participant Allure as Allure Results

  Engineer->>Yarn: yarn test:smoke
  Engineer->>Yarn: set ELECTRON_APP_BINARY_PATH
  Yarn->>WDIO: wdio run ./wdio.attach.conf.ts --suite smoke
  WDIO->>Service: create Electron capability
  Service->>Driver: start browser automation session
  Driver->>App: launch Electron 41 binary
  WDIO->>Spec: execute Mocha specs
  Spec->>App: interact through screen objects
  Spec->>Allure: add labels, steps, and attachments
  WDIO->>Allure: write test results and environment metadata
  Engineer->>Yarn: yarn allure:generate
  Yarn->>Allure: generate HTML report
```

## Page Object Model Flow

```mermaid
flowchart TD
  Spec["Spec file"] --> Data["Test data"]
  Spec --> Screen["Screen object"]
  Screen --> Base["BaseScreen"]
  Base --> SelectorHelper["Selector helper"]
  Base --> WaitHelper["Wait helper"]
  Screen --> WDIOElement["WDIO element API"]
  WDIOElement --> Renderer["Electron renderer DOM"]
  Spec --> Assertions["Chai assertions"]
  Spec --> Allure["Allure annotations and steps"]
```

## Packaged App Resolution

```mermaid
flowchart TD
  Start["Test command starts"] --> EnvCheck{"ELECTRON_APP_BINARY_PATH set?"}
  EnvCheck -- "Yes" --> Normalize["Normalize provided binary path"]
  Normalize --> RealApp["Launch real packaged Electron app"]
  EnvCheck -- "No" --> ConfigError["Fail fast with setup error"]
  RealApp --> WDIO["WDIO executes specs"]
```

## Allure Reporting Flow

```mermaid
flowchart LR
  Specs["Specs"] --> Labels["Labels: suite, epic, feature, story"]
  Specs --> Steps["Named steps"]
  Specs --> Attachments["JSON attachments"]
  WDIOHooks["WDIO hooks"] --> Environment["Environment metadata"]
  WDIOHooks --> FailureArtifacts["Failure screenshot and details"]
  Labels --> Results["reports/allure-results"]
  Steps --> Results
  Attachments --> Results
  Environment --> Results
  FailureArtifacts --> Results
  Results --> Generate["yarn allure:generate"]
  Generate --> Html["reports/allure-report"]
```

## Documentation Ownership

```mermaid
flowchart LR
  CodeChange["Framework code change"] --> DocReview["Documentation review"]
  DocReview --> ConfluenceDocs["docs/confluence Markdown"]
  ConfluenceDocs --> PullRequest["Commit and push"]
  PullRequest --> ConfluencePage["Upload or paste to Confluence"]
  ConfluencePage --> TeamUse["Team onboarding and reference"]
```
