#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { collectStoryFiles, parseStory } = require("./story-utils");
const { lintStory } = require("./lint-story-quality");

const EPIC_ACTORS = {
  "Core Platform Architecture": "quality engineer",
  "Project Workspace Management": "project administrator",
  "Test Case Management": "tester",
  "Test Organization Structuring": "tester",
  "Manual Test Execution": "tester",
  "Automated Test Execution": "test automation engineer",
  "Test Cycles and Plans": "qa lead",
  "Requirements and Traceability": "qa lead",
  Integrations: "integration engineer",
  "Reporting Dashboards": "qa lead",
  "Import Export Migration": "migration specialist",
  Collaboration: "team member",
  "Configuration Customization": "project administrator",
  "Security Audit Compliance": "security administrator",
  "Performance Scalability": "platform administrator",
  "Administration Maintenance": "platform administrator",
  Querying: "qa lead",
  API: "integration engineer",
  "User Management": "project administrator",
  "Custom Reporting": "qa lead",
  "Confluence Macro": "confluence user",
  "Risk Based Testing": "qa lead",
  "AI Capabilities": "tester",
  Documentation: "project member",
};

function usage() {
  console.error("Usage: node scripts/refine-generic-story-pack.js <input-directory> [--force]");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceLine(content, label, value) {
  const pattern = new RegExp(`^(\\*\\*${escapeRegex(label)}\\*\\*\\s*).+$`, "m");
  return content.replace(pattern, `$1${value}`);
}

function replaceStoryTitle(content, value) {
  return content.replace(/^# User Story:\s*.+$/m, `# User Story: ${value}`);
}

function replaceSection(content, heading, body) {
  const pattern = new RegExp(
    `(^## ${escapeRegex(heading)}\\s*$)([\\s\\S]*?)(?=^## |^---\\s*$|(?![\\s\\S]))`,
    "m"
  );

  if (!pattern.test(content)) {
    return content;
  }

  return content.replace(pattern, `$1\n${body.trim()}\n\n`);
}

function injectSection(content, anchorHeading, newHeading, body) {
  if (new RegExp(`^## ${escapeRegex(newHeading)}\\s*$`, "m").test(content)) {
    return replaceSection(content, newHeading, body);
  }

  const anchorPattern = new RegExp(`(^## ${escapeRegex(anchorHeading)}\\s*$)([\\s\\S]*?)(?=^## |^---\\s*$|(?![\\s\\S]))`, "m");
  if (!anchorPattern.test(content)) {
    // If anchor not found, append to end before references or at very end
    return content + `\n\n## ${newHeading}\n${body.trim()}\n`;
  }

  return content.replace(anchorPattern, (match) => {
    return `${match.trim()}\n\n## ${newHeading}\n${body.trim()}\n\n`;
  });
}

function removeSection(content, heading) {
  const pattern = new RegExp(
    `^## ${escapeRegex(heading)}\\s*$([\\s\\S]*?)(?=^## |^---\\s*$|(?![\\s\\S]))`,
    "m"
  );
  return content.replace(pattern, "").replace(/\n{3,}/g, "\n\n");
}

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function lowerFirst(value) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function normalizeTerminology(value) {
  if (!value) {
    return value;
  }

  const replacements = [
    [/\bjira\b/gi, "Jira"],
    [/\bconfluence\b/gi, "Confluence"],
    [/\bopenapi\b/gi, "OpenAPI"],
    [/\bswagger\b/gi, "Swagger"],
    [/\bwysiwyg\b/gi, "WYSIWYG"],
    [/\bmarkdown\b/gi, "Markdown"],
    [/\brag\b/gi, "RAG"],
    [/\bllm\b/gi, "LLM"],
    [/\btdd\b/gi, "TDD"],
    [/\bbdd\b/gi, "BDD"],
    [/\bgdpr\b/gi, "GDPR"],
    [/\bjunit4\b/gi, "JUnit 4"],
    [/\bjunit5\b/gi, "JUnit 5"],
    [/\bjunit 4\b/gi, "JUnit 4"],
    [/\bjunit 5\b/gi, "JUnit 5"],
    [/\bgitlab ci\b/gi, "GitLab CI"],
    [/\bjenkins\b/gi, "Jenkins"],
    [/\bcypress\b/gi, "Cypress"],
    [/\bplaywright\b/gi, "Playwright"],
    [/\bselenium\b/gi, "Selenium"],
    [/\bcucumber\b/gi, "Cucumber"],
    [/\bpostman\b/gi, "Postman"],
    [/\btestlink\b/gi, "TestLink"],
    [/\btmt\b/gi, "TMT"],
    [/\bapi\b/g, "API"],
    [/\bci\/cd\b/gi, "CI/CD"],
  ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function humanizeSubject(value) {
  return normalizeTerminology(String(value || "").trim().toLowerCase());
}

function deslugifyTitleSeed(fileName) {
  return String(fileName || "")
    .replace(/^US-\d+-/i, "")
    .replace(/\.md$/i, "")
    .replace(/-/g, " ")
    .trim();
}

function startsWithActionVerb(value) {
  const firstWord = String(value || "")
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  return [
    "access",
    "add",
    "analyze",
    "assign",
    "book",
    "cancel",
    "choose",
    "clone",
    "compare",
    "consult",
    "copy",
    "create",
    "delete",
    "detect",
    "define",
    "discuss",
    "edit",
    "embed",
    "export",
    "generate",
    "handle",
    "import",
    "integrate",
    "isolate",
    "link",
    "list",
    "manage",
    "mark",
    "monitor",
    "perform",
    "print",
    "preserve",
    "push",
    "remove",
    "reprint",
    "reuse",
    "restore",
    "review",
    "run",
    "save",
    "search",
    "select",
    "show",
    "support",
    "tag",
    "update",
    "use",
    "view",
  ].includes(firstWord);
}

function defaultVerbForType(type) {
  switch (type) {
    case "view":
    case "report":
      return "view";
    case "link":
      return "link";
    case "integration":
      return "import";
    case "manage":
      return "manage";
    case "workflow":
      return "perform";
    case "security":
      return "control";
    case "platform":
      return "provide";
    case "reuse":
      return "reuse";
    case "ai":
      return "generate";
    case "remove":
      return "remove";
    default:
      return "handle";
  }
}

function stripStoryPrefix(value) {
  let text = String(value || "").trim();
  let previous;

  do {
    previous = text;
    text = text
      .replace(/^to\s+/i, "")
      .replace(/^as\s+(?:a|an)\s+[^,]+,?\s*i want\s*/i, "")
      .replace(/^i want\s*/i, "")
      .trim();
  } while (text !== previous);

  return text;
}

function cleanGeneratedPhrase(value) {
  let text = String(value || "").trim();
  let previous;

  do {
    previous = text;
    text = text
      .replace(/^handle\s+/i, "")
      .replace(/^(handle|manage|provide|control|import|view|remove|support|use|perform)\s+(?=(manage|define|provide|support|view|run|generate|integrate|comment|discuss|preserve|monitor|delete|copy|reuse|add|select|export|import|review|create|embed|isolate|handle)\b)/i, "")
      .replace(/^(\w+)\s+\1\b\s*/i, "$1 ")
      .trim();
  } while (text !== previous);

  return text;
}

function titleToCapabilityPhrase(story, fallback) {
  const candidates = [
    deslugifyTitleSeed(story.fileName),
    story.title,
    fallback,
  ]
    .map((value) => cleanGeneratedPhrase(normalizeTerminology(stripStoryPrefix(String(value || "").trim()))))
    .filter(Boolean);

  const explicitPatterns = [
    [/^That a (.+?) contains(?: the following fields)?$/i, (_, subject) => `define ${humanizeSubject(subject)} fields`],
    [/^A manual which explains each feature$/i, () => "view a manual that explains each feature"],
    [/^A query query language to do advanced searches$/i, () => "run advanced searches with a query language"],
    [/^That the system generates test cases based on requirements$/i, () => "generate test cases from requirements"],
    [/^That the system is capable of generating diagrams of requirements$/i, () => "generate requirement diagrams"],
    [/^That the system can perform exploratory testing based on a high level test case$/i, () => "perform exploratory testing from a high-level test case"],
    [/^To take snapshots in an vectorDB$/i, () => "take snapshots in a vector database"],
    [/^A confluence macro to show test case,? and their results in confluence$/i, () => "show test cases and results in Confluence with a macro"],
    [/^Templates to start pipelines\/runs to run individual test cases, test classes, \.\.\. in CI\/CD platforms \((.+)\)$/i, () => "start pipelines for individual automated tests"],
    [/^CI pipelines to push results automatically, from: (.+)$/i, () => "push results automatically from CI pipelines"],
    [/^Data export of any given test suite\/collections? \(with options\) in .+$/i, () => "export selected test suite or collection data"],
    [/^Data export of a complete project \(with options\) in .+$/i, () => "export complete project data"],
    [/^Full data export$/i, () => "export full project data"],
    [/^Dry-run import validation$/i, () => "validate imports with a dry run"],
    [/^Execution progress reports$/i, () => "view execution progress reports"],
    [/^Real-time dashboards$/i, () => "view real-time dashboards"],
    [/^Custom dashboards$/i, () => "view custom dashboards"],
    [/^Dashboard with metrics$/i, () => "view dashboards with metrics"],
    [/^Exportable reports \((.+)\)$/i, (_, subject) => `export reports as ${humanizeSubject(subject)}`],
    [/^Automation vs manual ratios$/i, () => "view automation versus manual ratios"],
    [/^Trend analysis$/i, () => "view trend analysis"],
    [/^Coverage indicators$/i, () => "view coverage indicators"],
    [/^Traceability matrices$/i, () => "view traceability matrices"],
    [/^Activity history$/i, () => "view activity history"],
    [/^Notifications$/i, () => "view notifications"],
    [/^Comments on (.+)$/i, (_, subject) => `comment on ${humanizeSubject(subject)}`],
    [/^Execution discussions$/i, () => "discuss test execution"],
    [/^Shared documentation pages$/i, () => "use shared documentation pages"],
    [/^Mentions \(@user\)$/i, () => "mention users"],
    [/^Flaky test detection$/i, () => "detect flaky tests"],
    [/^Hierarchical collections or suites$/i, () => "organize hierarchical collections and suites"],
    [/^Reusable test sets$/i, () => "reuse test sets"],
    [/^Bulk edit capabilities$/i, () => "bulk edit test assets"],
    [/^Plain text test cases$/i, () => "create plain-text test cases"],
    [/^BDD test cases$/i, () => "create BDD test cases"],
    [/^Step-based TDD test cases$/i, () => "create step-based TDD test cases"],
    [/^Parameterized test cases$/i, () => "create parameterized test cases"],
    [/^Rich text editing \((.+)\)$/i, (_, subject) => `edit rich text with ${humanizeSubject(subject).replace("/", " and ")}`],
    [/^Webhook support$/i, () => "support webhooks"],
    [/^Jenkins integration$/i, () => "integrate with Jenkins"],
    [/^GitLab CI integration$/i, () => "integrate with GitLab CI"],
    [/^Confluence page embedding$/i, () => "embed Confluence pages"],
    [/^OAuth \/ token-based auth for integrations$/i, () => "manage OAuth and token-based integration authentication"],
    [/^CSV\/XML\/JSON imports$/i, () => "import CSV, XML, and JSON data"],
    [/^Usage analytics$/i, () => "view usage analytics"],
    [/^Feature flags$/i, () => "manage feature flags"],
    [/^Health monitoring$/i, () => "monitor platform health"],
    [/^Upgrade paths$/i, () => "manage upgrade paths"],
    [/^Backups and restores$/i, () => "manage backups and restores"],
    [/^Async processing$/i, () => "support asynchronous processing"],
    [/^Indexed search$/i, () => "provide indexed search"],
    [/^Horizontal scaling$/i, () => "support horizontal scaling"],
    [/^Performance metrics$/i, () => "monitor performance metrics"],
    [/^Plugin support for future extensions$/i, () => "support plugins for future extensions"],
    [/^Versioned APIs for backward compatibility$/i, () => "provide versioned APIs for backward compatibility"],
    [/^A modular architecture so features can be enabled\/disabled$/i, () => "provide a modular architecture for feature enablement"],
    [/^Fast response times even with large datasets$/i, () => "support fast response times with large datasets"],
    [/^Project(?: |-)?level configuration$/i, () => "manage project-level configuration"],
    [/^Isolated data per project$/i, () => "isolate data per project"],
    [/^Per(?: |-)?project configuration$/i, () => "manage per-project configuration"],
    [/^Custom fields$/i, () => "manage custom fields"],
    [/^Configurable statuses$/i, () => "manage configurable statuses"],
    [/^Custom workflows$/i, () => "manage custom workflows"],
    [/^Naming conventions$/i, () => "manage naming conventions"],
    [/^Audit logs$/i, () => "view audit logs"],
    [/^Permission scopes$/i, () => "manage permission scopes"],
    [/^Immutable execution history$/i, () => "preserve immutable execution history"],
    [/^GDPR-compliant data handling$/i, () => "handle data in a GDPR-compliant way"],
    [/^SSO support$/i, () => "support SSO"],
    [/^Rich Text Editing with (.+)$/i, (_, detail) => `edit rich text with ${humanizeSubject(detail)}`],
    [/^(.+) Detection$/i, (_, subject) => `detect ${humanizeSubject(subject)}`],
    [/^(.+) Monitoring$/i, (_, subject) => `monitor ${humanizeSubject(subject)}`],
    [/^(.+) Analysis$/i, (_, subject) => `analyze ${humanizeSubject(subject)}`],
    [/^Consult (.+)$/i, (_, subject) => `review ${humanizeSubject(subject)}`],
    [/^View (.+)$/i, (_, subject) => `view ${humanizeSubject(subject)}`],
    [/^See (.+)$/i, (_, subject) => `view ${humanizeSubject(subject)}`],
    [/^List (.+)$/i, (_, subject) => `list ${humanizeSubject(subject)}`],
    [/^Show (.+)$/i, (_, subject) => `show ${humanizeSubject(subject)}`],
    [/^Create (.+)$/i, (_, subject) => `create ${humanizeSubject(subject)}`],
    [/^Link (.+)$/i, (_, subject) => `link ${humanizeSubject(subject)}`],
    [/^Import (.+)$/i, (_, subject) => `import ${humanizeSubject(subject)}`],
    [/^Update (.+)$/i, (_, subject) => `update ${humanizeSubject(subject)}`],
    [/^Assign (.+)$/i, (_, subject) => `assign ${humanizeSubject(subject)}`],
    [/^Delete (.+)$/i, (_, subject) => `delete ${humanizeSubject(subject)}`],
    [/^Copy (.+)$/i, (_, subject) => `copy ${humanizeSubject(subject)}`],
    [/^Restore (.+)$/i, (_, subject) => `restore ${humanizeSubject(subject)}`],
    [/^Tag (.+)$/i, (_, subject) => `tag ${humanizeSubject(subject)}`],
    [/^Print (.+)$/i, (_, subject) => `print ${humanizeSubject(subject)}`],
    [/^Reprint (.+)$/i, (_, subject) => `reprint ${humanizeSubject(subject)}`],
    [/^Use (.+)$/i, (_, subject) => `use ${humanizeSubject(subject)}`],
    [/^Generate (.+)$/i, (_, subject) => `generate ${humanizeSubject(subject)}`],
    [/^Perform (.+)$/i, (_, subject) => `perform ${humanizeSubject(subject)}`],
  ];

  for (const candidate of candidates) {
    for (const [pattern, builder] of explicitPatterns) {
      const match = candidate.match(pattern);
      if (match) {
        return builder(...match);
      }
    }
  }

  const normalizedFallback = candidates[candidates.length - 1] || "";
  if (/^have\s+/i.test(normalizedFallback)) {
    return normalizedFallback.replace(/^have\s+/i, "use ");
  }

  return candidates[0] || normalizedFallback;
}

function capabilityPhrase(story) {
  const type = inferType(story);
  const phrase = titleToCapabilityPhrase(story, story.userStory.iWant);

  if (startsWithActionVerb(phrase)) {
    return phrase;
  }

  return `${defaultVerbForType(type)} ${phrase}`.trim();
}

function toStoryTitle(capability) {
  const lowerWords = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "with"]);

  return capability
    .split(/\s+/)
    .map((word, index) => {
      if (!word) {
        return word;
      }
      return word
        .split(/([/-])/)
        .map((part, partIndex) => {
          if (/^[/-]$/.test(part) || !part) {
            return part;
          }
          if (/^[A-Z0-9]+$/.test(part)) {
            return part;
          }
          if (index > 0 && partIndex === 0 && lowerWords.has(part.toLowerCase())) {
            return part.toLowerCase();
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("");
    })
    .join(" ");
}

function objectLabel(story, capability, type) {
  const title = story.title.toLowerCase();

  if (/link test cases to requirements/.test(title)) return "requirement links";
  if (/import results from/.test(title)) return "automation execution results";
  if (/openapi documentation|swagger viewer/.test(title)) return "OpenAPI documentation";
  if (/rich text editing/.test(title)) return "rich-text test content";
  if (/manual test cases/.test(title)) return "manual test cases";
  if (/rag|llm/.test(title)) return "repository-grounded AI answers";

  const stripped = capability
    .replace(/^(create|view|show|see|list|search|filter|query|add|attach|version|compare|restore|tag|reuse|link|delete|copy|select|execute|mark|pause|resume|re-run|send|store|assign|clone|book|cancel|update|record|print|reprint|support|save|archive|access|use|consult|review|choose|take|generate|perform|edit|detect|monitor|analyze)\s+/i, "")
    .trim();

  if (stripped) {
    return stripped;
  }

  return type === "workflow" ? "workflow state" : lowerFirst(normalizeTerminology(story.title));
}

function inferActor(story) {
  const currentActor = story.userStory.asA.trim();
  if (currentActor && !/^(user|system)$/i.test(currentActor)) {
    return currentActor;
  }

  const title = story.title.toLowerCase();

  if (/requirements/.test(title) && /test cases/.test(title)) {
    return "qa lead";
  }
  if (/openapi|swagger|public api/.test(title)) {
    return "integration engineer";
  }

  if (/jira|confluence|jenkins|gitlab|webhook|oauth|api|swagger|openapi|plugin/.test(title)) {
    return "integration engineer";
  }
  if (/role|permission|sso|audit|gdpr|security/.test(title)) {
    return "project administrator";
  }
  if (/dashboard|report|trend|matrix|coverage|query|search|filter/.test(title)) {
    return "qa lead";
  }
  if (/automation|cypress|playwright|selenium|junit|pipeline|ci|automation/.test(title)) {
    return "test automation engineer";
  }
  if (/manual test|test case|suite|collection|execution|cycle|plan/.test(title)) {
    return "tester";
  }

  return EPIC_ACTORS[story.epicFeature] || "project user";
}

function inferType(story) {
  const title = story.title.toLowerCase();
  const text = `${title} ${story.userStory.iWant.toLowerCase()} ${story.userStory.soThat.toLowerCase()}`;

  if (/rag|llm|\bai\b|vector|snapshot|generate|exploratory testing/.test(text)) return "ai";
  if (/report|dashboard|trend|matrix|indicator|metrics/.test(text)) return "report";
  if (/permission|role|audit|sso|oauth|gdpr|security/.test(text)) return "security";
  if (/performance|fast response|million|horizontal scaling|async|health monitoring|backup/.test(text)) return "platform";
  if (/api|swagger|openapi|webhook|jira|confluence|jenkins|gitlab|integration|import|export|macro/.test(text)) return "integration";
  if (/search|filter|query|list|see|view|show|consult/.test(text)) return "view";
  if (/link|assign|map|sync/.test(text)) return "link";
  if (/delete|archive|remove|revoke/.test(text)) return "remove";
  if (/copy|clone|reuse|restore|template/.test(text)) return "reuse";
  if (/execute|run|pause|resume|mark|record|send|start|cancel|update|book/.test(text)) return "workflow";
  if (/create|add|capture|save|store|attach|tag|version|print|reprint|choose|select/.test(text)) return "manage";
  return "general";
}

function buildOutcome(story, type) {
  const title = story.title.toLowerCase();

  if (/manual test case/.test(title)) {
    return "test coverage can be authored consistently before execution begins";
  }
  if (/rich text editing/.test(title)) {
    return "test steps, notes, and evidence remain readable for authors and reviewers";
  }
  if (/requirements/.test(title) && /link/.test(title)) {
    return "coverage can be traced from requirements to the tests and results that implement them";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "API consumers can review available endpoints and schemas without leaving TMT";
  }
  if (/import results from/.test(title)) {
    return "automated executions can update project history without manual result transcription";
  }
  if (/rag|llm chat/.test(title)) {
    return "teams can answer repository questions faster without manually searching across project artifacts";
  }
  if (/label/.test(title) && /reprint/.test(title)) {
    return "shipment recovery actions remain traceable when a print attempt fails";
  }
  if (/label/.test(title) && /print/.test(title)) {
    return "warehouse work can move packed orders into shipment without extra manual handoffs";
  }
  if (/risk/.test(title)) {
    return "risk information can influence planning and execution decisions before defects escape";
  }

  switch (type) {
    case "view":
      return "teams can inspect the right project information without rebuilding it manually";
    case "link":
      return "related requirements, tests, and execution records stay connected across the project lifecycle";
    case "remove":
      return "obsolete project data does not confuse active delivery work";
    case "reuse":
      return "teams can reuse proven setup faster instead of recreating the same assets from scratch";
    case "workflow":
      return "execution status and operational progress stay accurate for project decisions";
    case "report":
      return "stakeholders can monitor quality status without relying on manual reporting";
    case "integration":
      return "external tools and teams can exchange project data without manual re-entry";
    case "security":
      return "access and audit evidence remain controlled and reviewable";
    case "platform":
      return "the platform remains reliable as project scale and usage grow";
    case "ai":
      return "teams can accelerate analysis while keeping answers grounded in project knowledge";
    case "manage":
      return "project work can be maintained consistently inside the managed test repository";
    default:
      return "the project workflow can be completed consistently inside TMT";
  }
}

function buildAsIs(story, type) {
  const title = story.title.toLowerCase();

  if (/report|dashboard|trend|matrix|indicator|metrics|coverage|query|search|filter/.test(title)) {
    return "Today, the needed information is still spread across separate records, so teams have to assemble it manually before they can act.";
  }

  if (/import|export|sync|integration|api|webhook|openapi|swagger|jira|confluence|jenkins|gitlab|plugin/.test(title)) {
    return "Today, the workflow still depends on manual handoffs or disconnected system steps.";
  }

  if (/permission|role|sso|audit|gdpr|security|access/.test(title)) {
    return "Today, access and control are handled more broadly than this project-scoped need requires.";
  }

  if (/performance|scaling|millions|async|health|backup/.test(title)) {
    return "Today, the product still needs explicit scale or resilience handling for this area.";
  }

  if (/copy|clone|reuse|template|restore/.test(title)) {
    return "Today, users still need to rebuild or duplicate this work by hand.";
  }

  if (/create|update|delete|manage|add|assign|attach|tag|store|save|print|reprint|link/.test(title)) {
    return "Today, the capability is handled through a less direct or less consistent workflow.";
  }

  if (type === "view") {
    return "Today, the relevant information is not yet exposed as a dedicated project view.";
  }

  return "Today, the capability is not yet a dedicated project-scoped workflow.";
}

function buildToBe(story, actor, capability, outcome) {
  return `With this change, ${lowerFirst(actor)} can ${capability} inside the current project boundary, and ${outcome}.`;
}

function buildRelation(story, type) {
  const epic = story.epicFeature;

  const sameEpicByType = {
    view: `the other ${epic} stories that surface, filter, or inspect project information`,
    report: `the other ${epic} stories that turn execution data into visible status and trends`,
    link: `the other ${epic} stories that connect requirements, tests, and results`,
    integration: `the other ${epic} stories that move data between TMT and external systems`,
    manage: `the other ${epic} stories that create, update, or maintain core project data`,
    workflow: `the other ${epic} stories that move the project through a lifecycle or status change`,
    security: `the other ${epic} stories that control access, auditability, and compliance`,
    platform: `the other ${epic} foundation stories that the rest of the product depends on`,
    reuse: `the other ${epic} stories that let teams duplicate or reuse existing work`,
    ai: `the other ${epic} stories that use project knowledge to accelerate analysis`,
    remove: `the other ${epic} stories that retire or clean up obsolete project data`,
  };

  const productByType = {
    view: "Across the product, it improves findability and trust in project information",
    report: "Across the product, it supports decision-making without forcing manual reporting work",
    link: "Across the product, it keeps traceability intact from requirement to result",
    integration: "Across the product, it keeps TMT connected to external tools without losing control of the data",
    manage: "Across the product, it keeps core project records consistent and usable",
    workflow: "Across the product, it keeps operational state aligned for downstream work",
    security: "Across the product, it protects project boundaries and audit evidence",
    platform: "Across the product, it provides the foundation that later epics can safely build on",
    reuse: "Across the product, it reduces duplicate effort and keeps setup consistent",
    ai: "Across the product, it supports faster analysis while staying grounded in project knowledge",
    remove: "Across the product, it keeps old data from confusing active delivery work",
  };

  return `It sits with ${sameEpicByType[type] || `the other ${epic} stories in this epic`} and ${productByType[type] || "supports the broader TMT product"}`;
}

function buildContext(story, actor, capability, outcome, type) {
  const asIs = buildAsIs(story, type);
  const toBe = buildToBe(story, actor, capability, outcome);
  const relation = buildRelation(story, type);
  return `This story adds the ability for ${lowerFirst(actor)} to ${capability} in the ${story.epicFeature} epic. ${asIs} ${toBe} ${relation}`;
}

function buildSuccessThen(story, type, capability, objectPhrase) {
  const title = story.title.toLowerCase();

  if (/link test cases to requirements/.test(title)) {
    return "the selected test case and requirement are linked and the relationship is visible from the affected records";
  }
  if (/import results from/.test(title)) {
    return "the imported automation results are recorded against the relevant test assets and execution history";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "the current API operations, schemas, and request details are visible in the Swagger viewer";
  }
  if (/rich text editing/.test(title)) {
    return "the updated rich-text content is saved and remains readable in both editing modes";
  }
  if (/rag|llm/.test(title)) {
    return "the response is returned from project-scoped repository knowledge with relevant supporting context";
  }

  switch (type) {
    case "view":
    case "report":
      return `the relevant ${objectPhrase} is shown for the current project scope`;
    case "link":
      return `the new relationship is saved and visible from the affected project records`;
    case "remove":
      return `the affected ${objectPhrase} is removed from active use in the current project`;
    case "reuse":
      return `the duplicated or reusable ${objectPhrase} is created from the selected source`;
    case "workflow":
      return `the updated ${objectPhrase} state is saved and shown to the user`;
    case "integration":
      return `the ${objectPhrase} flow completes and the project data remains synchronized in the relevant target area`;
    case "security":
      return `the ${objectPhrase} change is applied only within the permitted project scope`;
    case "platform":
      return `the ${objectPhrase} capability is available within the expected project scale and operating boundaries`;
    case "ai":
      return `the response is returned from project-scoped repository knowledge with relevant supporting context`;
    case "manage":
      return `the new or updated ${objectPhrase} is saved inside the current project`;
    default:
      return `the ${objectPhrase} capability is completed for the current project`;
  }
}

function buildThirdScenario(story, type, objectPhrase) {
  const title = story.title.toLowerCase();

  if (/audit|history|version|traceability|link|risk|result|evidence|log/.test(title)) {
    return {
      name: "Traceability and audit evidence",
      given: `the ${objectPhrase} activity affects stored project records`,
      when: `the ${objectPhrase} action completes`,
      then: "the resulting change remains traceable with the affected records and timestamps",
    };
  }

  if (/cross-project|project/.test(title)) {
    return {
      name: "Project scope boundaries are preserved",
      given: `another project contains similar ${objectPhrase}`,
      when: `the user works with ${objectPhrase} in the current project`,
      then: "data from other projects is not exposed or changed unless the story explicitly allows it",
    };
  }

  if (/performance|fast response|million|horizontal scaling|async/.test(title)) {
    return {
      name: "Scale expectations remain visible",
      given: `the project contains a representative volume of ${objectPhrase}`,
      when: `the ${objectPhrase} capability is exercised`,
      then: "the platform stays within the expected response and scalability boundaries for this story",
    };
  }

  if (/rag|llm|ai|vector|generate/.test(title)) {
    return {
      name: "Responses stay grounded in project knowledge",
      given: "the project contains indexed repository artifacts relevant to the question",
      when: "the user requests an answer or generated output from the AI capability",
      then: "the response stays grounded in project-scoped source material instead of unsupported invention",
    };
  }

  if (/jira|confluence|jenkins|gitlab|api|import|export|webhook|macro/.test(title)) {
    return {
      name: "External references remain consistent",
      given: `the ${objectPhrase} workflow exchanges data with an external target`,
      when: "the action completes successfully",
      then: "the relevant identifiers, links, or payload results remain consistent across the connected systems",
    };
  }

  return {
    name: "Project state remains traceable",
    given: `the ${objectPhrase} action changes project data or workflow state`,
    when: "the action succeeds",
    then: "the resulting state remains visible and traceable in the relevant TMT area",
  };
}

function buildAcceptanceCriteria(story, actor, type) {
  const capability = capabilityPhrase(story);
  const objectPhrase = objectLabel(story, capability, type);
  const actorPhrase = `${articleFor(actor)} ${actor}`;
  const successThen = buildSuccessThen(story, type, capability, objectPhrase);
  const third = buildThirdScenario(story, type, objectPhrase);

  return [
    `### Scenario 1: Valid project-scoped ${story.title}`,
    `**Given** ${actorPhrase} is working in a TMT project with the required ${objectPhrase} context`,
    `**When** they ${capability} using valid project data`,
    `**Then** ${successThen}`,
    "",
    `### Scenario 2: Invalid input or insufficient permission`,
    `**Given** the ${objectPhrase} request is missing required data or the user lacks the needed permission`,
    `**When** they attempt to ${capability}`,
    `**Then** the system blocks the change and explains what must be corrected before the workflow can continue`,
    "",
    `### Scenario 3: ${third.name}`,
    `**Given** ${third.given}`,
    `**When** ${third.when}`,
    `**Then** ${third.then}`,
  ].join("\n");
}

function buildDependencies(story, type, capability) {
  const objectPhrase = objectLabel(story, capability, type);

  if (/link test cases to requirements/i.test(story.title)) {
    return "- Requires project-scoped requirement records, test cases, and traceability persistence.";
  }
  if (/import results from/i.test(story.title)) {
    return "- Requires project-scoped ingestion, parsing, and result-mapping support for supported automation frameworks.";
  }
  if (/openapi documentation|swagger viewer/i.test(story.title)) {
    return "- Requires published API documentation and a project-scoped Swagger viewing surface.";
  }
  if (/rich text editing/i.test(story.title)) {
    return "- Requires project-scoped storage and rendering support for Markdown and WYSIWYG editing modes.";
  }
  if (/rag|llm/i.test(story.title)) {
    return "- Requires project-scoped repository content, indexing, and retrieval support for grounded AI responses.";
  }

  if (type === "integration") {
    return `- Requires project-scoped connection, credential, and persistence support for ${objectPhrase}.`;
  }
  if (type === "report" || type === "view") {
    return `- Requires project-scoped retrieval of the data needed to support ${objectPhrase}.`;
  }
  if (type === "security") {
    return `- Requires project-scoped authorization and audit storage for ${objectPhrase}.`;
  }
  if (type === "platform") {
    return `- Requires platform services that can sustain ${objectPhrase} within the stated volume or performance expectations.`;
  }
  if (type === "ai") {
    return `- Requires project-scoped repository content and retrieval support for ${objectPhrase}.`;
  }
  return `- Requires project-scoped authorization and persistence support for ${objectPhrase}.`;
}

function buildUx(story, type) {
  const title = story.title.toLowerCase();

  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Show API operations, schemas, and request details in a readable browser-based viewer.";
  }
  if (/rich text editing/.test(title)) {
    return "- Let authors switch between Markdown and WYSIWYG editing without losing formatting intent.";
  }
  if (/dashboard|report|trend|matrix|indicator/.test(title)) {
    return "- Make scoped data easy to scan and filter without forcing the user into multiple navigation steps.";
  }
  if (/search|filter|query|list|view|see|show/.test(title)) {
    return "- Keep the result view readable so users can confirm scope and outcome without extra interpretation work.";
  }
  if (/create|edit|update|assign|link|book|cancel|execute|mark|attach|comment|tag|print|reprint/.test(title)) {
    return "- Provide clear validation, success, and failure feedback at the point where the user performs the action.";
  }
  if (type === "integration" || type === "platform" || type === "security") {
    return "N/A";
  }

  return "N/A";
}

function buildTestingNotes(story, type) {
  const title = story.title.toLowerCase();

  if (/import results from/.test(title)) {
    return "- Cover supported framework payload parsing, rejected unsupported input, and result mapping into execution history.";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Cover viewer availability, permission-limited visibility, and refresh behavior when API documentation changes.";
  }
  if (/rich text editing/.test(title)) {
    return "- Cover mode switching, persisted formatting, and validation of rich-text content in both editors.";
  }
  if (type === "ai") {
    return "- Cover grounded responses, missing-source handling, and traceability of generated answers back to project knowledge.";
  }
  if (type === "integration") {
    return "- Cover successful data exchange, invalid external input, and traceability of synchronized records.";
  }
  if (type === "view" || type === "report") {
    return "- Cover scoped retrieval, empty-state behavior, and permission-limited visibility for the displayed data.";
  }
  if (type === "workflow" || type === "manage" || type === "link") {
    return "- Cover the primary success path, validation or permission failures, and persistence of the resulting project state.";
  }
  if (type === "platform") {
    return "- Cover response-time expectations, failure recovery, and representative load for the targeted scale scenario.";
  }
  if (type === "security") {
    return "- Cover permission enforcement, blocked unauthorized changes, and the resulting audit evidence.";
  }

  return "N/A";
}

function buildOpenQuestions(story, type) {
  const title = story.title.toLowerCase();

  if (type === "ai") {
    return "- Which repository artifacts should be considered authoritative sources for grounded answers in this project?";
  }
  if (/import results from/.test(title)) {
    return "- Which automation result formats are mandatory for the first delivery slice, and which can follow later?";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Should the viewer expose only released API versions or also in-progress project endpoints?";
  }

  return "N/A";
}

function buildImplementationNotes(story, type) {
  const title = story.title.toLowerCase();

  if (/import results from/.test(title)) {
    return "- Keep parser adapters separate from execution-history persistence so additional framework formats can be added without rewriting core result handling.";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Keep the documentation publishing path separate from the viewer surface so API versioning can evolve independently.";
  }
  if (/rich text editing/.test(title)) {
    return "- Keep editor-state conversion explicit so Markdown and WYSIWYG rendering do not drift across saves.";
  }
  if (type === "ai") {
    return "- Keep retrieval and answer-generation components project-scoped so repository content does not leak across projects.";
  }
  if (type === "security") {
    return "- Implement permission enforcement and audit capture together so privileged actions cannot bypass traceability.";
  }
  if (type === "platform") {
    return "- Prefer designs that preserve project isolation and operability as throughput or data volume increases.";
  }

  return "N/A";
}

function buildDataModelFields(story, type, objectPhrase) {
  const fields = [
    { name: "id", spec: "UUID, Mandatory", purpose: "Unique identifier for the record." },
    { name: "projectId", spec: "UUID, Mandatory", purpose: "Project ownership for scoping." },
    { name: "status", spec: "Enum, Mandatory", purpose: "Current operational state." }
  ];

  if (type === "manage" || type === "workflow" || type === "view") {
    fields.push({ name: "name", spec: "String(255), Mandatory", purpose: "Display name." });
    fields.push({ name: "description", spec: "Text, Optional", purpose: "Detailed context." });
  }

  const table = [
    "| Field | Technical Specs | Business Purpose & Functional Use Case |",
    "| :--- | :--- | :--- |",
    ...fields.map(f => `| ${f.name} | ${f.spec} | ${f.purpose} |`)
  ].join("\n");

  return table;
}

function buildUiInteraction(story, capability) {
  return [
    `1. **Navigation**: Main Menu > ${story.epicFeature}`,
    `2. **Access**: List View > Select Item`,
    `3. **Trigger**: "${toStoryTitle(capability)}" button`,
    `4. **Action**: Complete requested information and submit`,
    `5. **Result**: System processes the change and provides success feedback`
  ].join("\n");
}

function buildApiContract(story, type, capability, objectPhrase) {
  const method = type === "manage" ? "POST" : (type === "workflow" ? "PATCH" : "GET");
  const path = `/api/v1/${slugify(story.epicFeature)}/${slugify(objectPhrase)}`;
  
  return [
    `- **Endpoint**: \`${method} ${path}\``,
    `- **Method**: \`${method}\``,
    `- **Authentication**: JWT (Stateless)`,
    `- **Request Body**:`,
    "```json",
    "{",
    `  "projectId": "uuid",`,
    `  "action": "${capability}"`,
    "}",
    "```",
    `- **Response**: \`200 OK\``,
    `- **Error Codes**:`,
    "    - `400 Bad Request`: Input validation failed",
    "    - `403 Forbidden`: Insufficient project permissions"
  ].join("\n");
}

function buildFunctionalRequirements(story) {
  return [
    `1. **Core Logic**: The system must correctly ${lowerFirst(story.userStory.iWant)}.`,
    `2. **Validation**: All inputs must be validated against the project-specific rules.`
  ].join("\n");
}

function buildNonFunctionalRequirements() {
  return [
    "### Performance",
    "- API response: < 500ms",
    "### Usability",
    "- Mobile responsive layout",
    "### Security",
    "- Role-Based Access Control (RBAC) enforced"
  ].join("\n");
}

function buildTechnicalConsiderations() {
  return [
    "### Frontend",
    "- Component: Angular standalone component",
    "- State: RxJS-based store",
    "### Backend",
    "- Service: Spring Boot @Service",
    "- Logic: Domain-driven service layer",
    "### Database",
    "- Storage: PostgreSQL via Hibernate"
  ].join("\n");
}

function buildQaStrategy(story, type) {
  return [
    "### Test Coverage Requirements",
    "- **Unit Tests:** 80% Min",
    "- **Integration Tests:** 100% API coverage",
    "- **E2E Tests:** Primary success path"
  ].join("\n");
}

function buildDod() {
  return [
    "- [ ] Code reviewed & approved",
    "- [ ] Unit tests passing (>80%)",
    "- [ ] API contract verified",
    "- [ ] AC verified manually & via E2E",
    "- [ ] Documentation updated"
  ].join("\n");
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function needsRefinement(story) {
  const issues = lintStory(story);
  return issues.some((issue) =>
    issue.field === "userStory.asA" ||
    issue.field === "userStory.soThat" ||
    issue.field === "context" ||
    issue.field.startsWith("acceptanceCriteria") ||
    issue.field === "dependencies"
  );
}

function refineStoryContent(content, story) {
  const actor = inferActor(story);
  const type = inferType(story);
  const capability = capabilityPhrase(story);
  const storyTitle = toStoryTitle(capability);
  const objectPhrase = objectLabel(story, capability, type);
  const outcome = buildOutcome(story, type);
  const context = buildContext(story, actor, capability, outcome, type);
  const acceptanceCriteria = buildAcceptanceCriteria(story, actor, type);
  const dependencies = buildDependencies(story, type, capability);
  const implementationNotes = buildImplementationNotes(story, type);
  
  // New TMT Sections
  const dataModel = buildDataModelFields(story, type, objectPhrase);
  const uiInteraction = buildUiInteraction(story, capability);
  const apiContract = buildApiContract(story, type, capability, objectPhrase);
  const funcReqs = buildFunctionalRequirements(story);
  const nfrs = buildNonFunctionalRequirements();
  const techCons = buildTechnicalConsiderations();
  const qaStrategy = buildQaStrategy(story, type);
  const dod = buildDod();

  let updated = content;
  updated = replaceStoryTitle(updated, storyTitle);
  updated = replaceLine(updated, "As a", actor);
  updated = replaceLine(updated, "I want", `to ${capability}`);
  updated = replaceLine(updated, "So that", outcome);
  updated = replaceSection(updated, "Context", context);
  
  // Inject/Replace TMT Sections in ordered sequence
  updated = injectSection(updated, "Context", "Data Model (Fields)", dataModel);
  updated = injectSection(updated, "Data Model (Fields)", "WebApp (UI) Interaction", uiInteraction);
  updated = injectSection(updated, "WebApp (UI) Interaction", "API (REST) Contract", apiContract);
  updated = injectSection(updated, "API (REST) Contract", "Functional Requirements", funcReqs);
  
  updated = replaceSection(updated, "Acceptance Criteria", acceptanceCriteria);
  
  updated = injectSection(updated, "Acceptance Criteria", "Non-Functional Requirements", nfrs);
  updated = injectSection(updated, "Non-Functional Requirements", "Technical Considerations", techCons);
  
  updated = replaceSection(updated, "Dependencies", dependencies);
  
  updated = injectSection(updated, "Dependencies", "QA & Testing Strategy", qaStrategy);
  updated = injectSection(updated, "QA & Testing Strategy", "Definition of Done (DoD)", dod);

  // Cleanup old sections (migrated to new technical ones)
  updated = removeSection(updated, "UX");
  updated = removeSection(updated, "Testing Notes");
  updated = removeSection(updated, "Non-Functional Notes");

  updated = replaceSection(updated, "Open Questions", buildOpenQuestions(story, type));
  updated = replaceSection(updated, "Implementation Notes", implementationNotes);
  
  return updated;
}

function refineStoryFile(filePath, options = {}) {
  const story = parseStory(filePath);
  if (!story || (!options.force && !needsRefinement(story))) {
    return false;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const updated = refineStoryContent(original, story);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    return true;
  }

  return false;
}

function refineStoryPack(inputDir, options = {}) {
  const files = collectStoryFiles(inputDir);
  let updatedCount = 0;

  for (const filePath of files) {
    if (refineStoryFile(filePath, options)) {
      updatedCount += 1;
    }
  }

  return { inputDir, updatedCount };
}

function main() {
  const args = process.argv.slice(2);
  const inputDir = args.find((arg) => !arg.startsWith("--"));
  const force = args.includes("--force");
  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const result = refineStoryPack(inputDir, { force });
    console.log(`Refined ${result.updatedCount} story file(s) in ${result.inputDir}.`);
  } catch (error) {
    console.error(`Story refinement failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  refineStoryContent,
  refineStoryFile,
  refineStoryPack,
};
