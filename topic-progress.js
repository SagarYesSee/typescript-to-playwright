// IDs are permanent: never renumber or reuse an ID when editing a topic.
(function (root) {
  var days = {
  "1": [
    {
      "id": "d01-t01",
      "name": "Node and npm setup",
      "task": "Install Node.js, use the terminal, and learn npm, npx, `package.json`, scripts and the lockfile."
    },
    {
      "id": "d01-t02",
      "name": "Git repository",
      "task": "Initialize Git, add a suitable `.gitignore`, and commit a small program."
    }
  ],
  "2": [
    {
      "id": "d02-t01",
      "name": "Values and control flow",
      "task": "Practice `const`, `let`, primitive types, comparisons, template strings, conditions, loops and null checks."
    },
    {
      "id": "d02-t02",
      "name": "Classify test results",
      "task": "Classify a list of test results as passed, failed or skipped."
    }
  ],
  "3": [
    {
      "id": "d03-t01",
      "name": "Array transformations",
      "task": "Use destructuring, spread, `find`, `filter` and `map` on product data."
    },
    {
      "id": "d03-t02",
      "name": "Cart calculations",
      "task": "Find an item by name and calculate the total for a cart containing two different quantities."
    }
  ],
  "4": [
    {
      "id": "d04-t01",
      "name": "Typed functions",
      "task": "Write typed functions and arrow functions."
    },
    {
      "id": "d04-t02",
      "name": "Parameters and exports",
      "task": "Practice default and optional parameters, return types, imports and exports."
    },
    {
      "id": "d04-t03",
      "name": "Extract a module",
      "task": "Move the cart calculator to a separate module."
    }
  ],
  "5": [
    {
      "id": "d05-t01",
      "name": "Types and interfaces",
      "task": "Define a type alias, an interface, a union and an optional field."
    },
    {
      "id": "d05-t02",
      "name": "Null narrowing",
      "task": "Narrow a possibly missing value."
    },
    {
      "id": "d05-t03",
      "name": "Compiler feedback",
      "task": "Try a wrong field type and explain the compiler error."
    }
  ],
  "6": [
    {
      "id": "d06-t01",
      "name": "Promise functions",
      "task": "Write a function that returns a promise."
    },
    {
      "id": "d06-t02",
      "name": "Await and error handling",
      "task": "Practice `await`, rejected promises and `try/catch/finally`."
    },
    {
      "id": "d06-t03",
      "name": "Sequential and concurrent requests",
      "task": "Compare a sequential `for...of` loop with `Promise.all` for independent requests."
    }
  ],
  "7": [
    {
      "id": "d07-t01",
      "name": "Project type checking",
      "task": "Set up a `tsconfig.json` that includes your code and run `npx tsc --noEmit`."
    },
    {
      "id": "d07-t02",
      "name": "Fetch and HTTP status",
      "task": "Fetch a practice API record, check its HTTP status and print a field."
    },
    {
      "id": "d07-t03",
      "name": "Catch a type error",
      "task": "Make a deliberate type mistake and catch it from the terminal."
    }
  ],
  "8": [
    {
      "id": "d08-t01",
      "name": "Starter and login tests",
      "task": "Run the starter test, then write a login test in a new file."
    },
    {
      "id": "d08-t02",
      "name": "Runner modes",
      "task": "Run it headless, headed and in UI Mode."
    },
    {
      "id": "d08-t03",
      "name": "Browser object model",
      "task": "Explain what the runner, browser, context, page and locator each do."
    },
    {
      "id": "d08-extension",
      "name": "CLI selection and installation",
      "task": "Use CLI help, install Chromium and run a test by line number. See CLI practice."
    }
  ],
  "9": [
    {
      "id": "d09-t01",
      "name": "Base URL and projects",
      "task": "Set `baseURL`, use a relative path in `page.goto()`, and configure Chromium, Firefox and WebKit projects."
    },
    {
      "id": "d09-t02",
      "name": "Single and cross-browser runs",
      "task": "Run the login test in one project and then all three."
    }
  ],
  "10": [
    {
      "id": "d10-t01",
      "name": "Inspect a form",
      "task": "Inspect a form in DevTools."
    },
    {
      "id": "d10-t02",
      "name": "Accessible locator attributes",
      "task": "Identify its role, accessible name, label, placeholder and test ID."
    },
    {
      "id": "d10-t03",
      "name": "Predict locator matches",
      "task": "Predict which of two similarly labeled buttons a locator will match."
    }
  ],
  "11": [
    {
      "id": "d11-t01",
      "name": "Locator strategies",
      "task": "Use role, label, text and test ID locators."
    },
    {
      "id": "d11-t02",
      "name": "Scope to a row or card",
      "task": "Scope to a product card or table row with `filter({ hasText: ... })`."
    },
    {
      "id": "d11-t03",
      "name": "Resolve strictness errors",
      "task": "Reproduce a strictness error and fix the ambiguity."
    }
  ],
  "12": [
    {
      "id": "d12-t01",
      "name": "Assertion types",
      "task": "Check URL, title, text, count, value, visibility, and enabled or checked state."
    },
    {
      "id": "d12-t02",
      "name": "Retrying versus one-time checks",
      "task": "Compare a retrying locator assertion with a one-time value read on an element that updates late."
    }
  ],
  "13": [
    {
      "id": "d13-t01",
      "name": "Delayed controls",
      "task": "Observe a button that becomes enabled later."
    },
    {
      "id": "d13-t02",
      "name": "Actionability and navigation",
      "task": "Practice actionability checks, `waitForURL` and an assertion on content that loads later."
    },
    {
      "id": "d13-t03",
      "name": "Timeouts without sleeps",
      "task": "Identify test and assertion timeouts, and fix a delayed-content test without a fixed sleep."
    },
    {
      "id": "d13-extension",
      "name": "Controlled loading states",
      "task": "Hold and release a routed response; assert loading and loaded states. See Controlled loading."
    }
  ],
  "14": [
    {
      "id": "d14-t01",
      "name": "Login scenarios",
      "task": "Write valid-login and rejected-login tests from a blank file."
    },
    {
      "id": "d14-t02",
      "name": "Select one test",
      "task": "Run either test on its own."
    },
    {
      "id": "d14-t03",
      "name": "Inspect generated locators",
      "task": "Use the VS Code extension, Inspector or codegen to explore a locator and explain why you kept or edited it."
    },
    {
      "id": "d14-t04",
      "name": "Review quiz",
      "task": "Then take the quiz."
    }
  ],
  "15": [
    {
      "id": "d15-t01",
      "name": "Click variants",
      "task": "Practice a single click, double-click, right-click and modifier-click."
    },
    {
      "id": "d15-t02",
      "name": "Context menu assertions",
      "task": "Open a context menu and assert that the expected menu item appears."
    },
    {
      "id": "d15-t03",
      "name": "Double-click outcomes",
      "task": "Use a separate assertion for what double-clicking changes."
    }
  ],
  "16": [
    {
      "id": "d16-t01",
      "name": "Hover actions",
      "task": "Reveal a hidden action by hovering over its parent."
    },
    {
      "id": "d16-t02",
      "name": "Scroll containers",
      "task": "Try an offscreen item, a nested scroll container and an infinite list."
    },
    {
      "id": "d16-t03",
      "name": "Automatic and explicit scrolling",
      "task": "Observe automatic scrolling, then use `scrollIntoViewIfNeeded()` or `mouse.wheel()` where scrolling itself triggers behavior."
    }
  ],
  "17": [
    {
      "id": "d17-t01",
      "name": "Drag and drop",
      "task": "Drag a card with `locator.dragTo()` and verify its new column or order."
    },
    {
      "id": "d17-t02",
      "name": "Precise pointer input",
      "task": "Use `page.mouse.move/down/up` on a drawing surface or slider where the pointer position matters."
    }
  ],
  "18": [
    {
      "id": "d18-t01",
      "name": "Keyboard navigation",
      "task": "Navigate with Tab and Shift+Tab, activate with Enter or Space, close a menu with Escape and use an arrow-key shortcut."
    },
    {
      "id": "d18-t02",
      "name": "Focus assertions",
      "task": "Assert focus with `toBeFocused()`."
    },
    {
      "id": "d18-t03",
      "name": "Fill versus key events",
      "task": "Compare `fill()` with key-by-key typing in a field that reacts to each keystroke."
    }
  ],
  "19": [
    {
      "id": "d19-t01",
      "name": "Input and selection controls",
      "task": "Fill and clear text, check and uncheck a checkbox, choose a radio button, and interact with a disabled or read-only field."
    },
    {
      "id": "d19-t02",
      "name": "Form validation",
      "task": "Submit an incomplete form and verify its validation behavior."
    }
  ],
  "20": [
    {
      "id": "d20-t01",
      "name": "Native selects",
      "task": "Select one and multiple options from a native `<select>`."
    },
    {
      "id": "d20-t02",
      "name": "Custom autocomplete",
      "task": "Open a custom combobox, type a partial match and select a visible option by role."
    },
    {
      "id": "d20-t03",
      "name": "Assert selected values",
      "task": "Assert the submitted value or resulting filter."
    }
  ],
  "21": [
    {
      "id": "d21-t01",
      "name": "Calendar boundaries",
      "task": "Set a native date input, then operate a custom calendar across a month boundary."
    },
    {
      "id": "d21-t02",
      "name": "Mobile touch input",
      "task": "Run one interaction in a touch-enabled mobile browser project and use `tap()` to open its menu."
    }
  ],
  "22": [
    {
      "id": "d22-t01",
      "name": "Start popup wait",
      "task": "Start `page.waitForEvent('popup')` before clicking a link that opens a child page."
    },
    {
      "id": "d22-t02",
      "name": "Verify and close child page",
      "task": "Assert its heading or URL, close it, and check the original page still works."
    },
    {
      "id": "d22-t03",
      "name": "Context page events",
      "task": "Also practice the context-level `page` event."
    }
  ],
  "23": [
    {
      "id": "d23-t01",
      "name": "Alert confirm and prompt",
      "task": "Handle an alert, accept and dismiss a confirm in separate tests, and enter text into a prompt."
    },
    {
      "id": "d23-t02",
      "name": "Dialog handlers",
      "task": "Register a one-time `dialog` handler before the triggering action, accept or dismiss in the handler, and verify the result on the page."
    }
  ],
  "24": [
    {
      "id": "d24-t01",
      "name": "Cancel an HTML modal",
      "task": "Open an HTML confirmation modal, scope to `getByRole('dialog')` when that role exists, and choose Cancel."
    },
    {
      "id": "d24-t02",
      "name": "Verify no deletion",
      "task": "Assert that the modal closes without deleting the item."
    },
    {
      "id": "d24-t03",
      "name": "Tooltips and overlays",
      "task": "Practice a tooltip and an overlay that intercepts clicks."
    }
  ],
  "25": [
    {
      "id": "d25-t01",
      "name": "Frame locators",
      "task": "Use `frameLocator()` for a field inside an iframe."
    },
    {
      "id": "d25-t02",
      "name": "Nested frame scoping",
      "task": "Repeat with a nested frame and an identically named field on the outer page."
    },
    {
      "id": "d25-t03",
      "name": "Verify target isolation",
      "task": "Assert that only the intended field changed."
    }
  ],
  "26": [
    {
      "id": "d26-t01",
      "name": "File input variants",
      "task": "Use `setInputFiles()` on a file input, attach multiple files where supported, and clear the selection."
    },
    {
      "id": "d26-t02",
      "name": "Dynamic file chooser",
      "task": "Handle a dynamic file chooser by starting the event wait before the click."
    },
    {
      "id": "d26-t03",
      "name": "Upload outcome",
      "task": "Assert the filename or the app's upload result."
    }
  ],
  "27": [
    {
      "id": "d27-t01",
      "name": "Capture and save download",
      "task": "Start the `download` event wait before clicking Export, check the suggested filename, and save to a per-test output path."
    },
    {
      "id": "d27-t02",
      "name": "Verify exported contents",
      "task": "Read the exported file and assert a known header and row."
    }
  ],
  "28": [
    {
      "id": "d28-t01",
      "name": "Mixed interaction exercise",
      "task": "From memory: read content in a new tab, cancel a native confirm, close an HTML modal and fill an embedded form."
    },
    {
      "id": "d28-t02",
      "name": "Identify page event and frame ownership",
      "task": "For each, say which page, event or frame owns the interaction."
    }
  ],
  "29": [
    {
      "id": "d29-t01",
      "name": "Business-key row lookup",
      "task": "Find a row by its business identifier, act inside that row and assert a specific cell."
    },
    {
      "id": "d29-t02",
      "name": "Search sort and pagination",
      "task": "Exercise search, sorting and pagination with data whose expected order you know."
    }
  ],
  "30": [
    {
      "id": "d30-t01",
      "name": "Replaced DOM elements",
      "task": "Test an element that is replaced after loading."
    },
    {
      "id": "d30-t02",
      "name": "Open shadow roots",
      "task": "Find a control inside an open shadow root and inspect its host in DevTools."
    },
    {
      "id": "d30-t03",
      "name": "Stable repeated-item locators",
      "task": "Select a repeated item without relying on its position."
    }
  ],
  "31": [
    {
      "id": "d31-t01",
      "name": "History and client routing",
      "task": "Exercise back/forward navigation and a client-side route change."
    },
    {
      "id": "d31-t02",
      "name": "Wait for the intended response",
      "task": "Start a `waitForResponse` before clicking Search, match the intended endpoint and method, and verify the rendered results."
    }
  ],
  "32": [
    {
      "id": "d32-t01",
      "name": "Debug and UI modes",
      "task": "Run one test with `--debug` and another with `--ui`."
    },
    {
      "id": "d32-t02",
      "name": "Breakpoints and browser errors",
      "task": "Add a breakpoint or `page.pause()`, inspect the DOM, and collect console messages and page errors from a deliberately broken page."
    }
  ],
  "33": [
    {
      "id": "d33-t01",
      "name": "Page and element screenshots",
      "task": "Capture a page and an element screenshot."
    },
    {
      "id": "d33-t02",
      "name": "Failure artifacts",
      "task": "Configure failure artifacts."
    },
    {
      "id": "d33-t03",
      "name": "Read a failing trace",
      "task": "Record a trace of a failing test and find the first wrong step using the DOM snapshot, action log or network panel."
    }
  ],
  "34": [
    {
      "id": "d34-t01",
      "name": "Introduce common failures",
      "task": "In a throwaway test, introduce an ambiguous locator, a missing `await` and a timing assumption."
    },
    {
      "id": "d34-t02",
      "name": "Fix causes and repeat",
      "task": "Reproduce each failure, fix its cause, and repeat the test with retries disabled."
    },
    {
      "id": "d34-extension",
      "name": "AI code review and sanitized debugging",
      "task": "Review a diff and debug a synthetic reproduction without exposing secrets. See AI debugging and review."
    }
  ],
  "35": [
    {
      "id": "d35-t01",
      "name": "Read a failed report",
      "task": "Start from a failed HTML report."
    },
    {
      "id": "d35-t02",
      "name": "Write a reproduction",
      "task": "Describe the expected behavior, actual behavior and the smallest reproduction."
    },
    {
      "id": "d35-t03",
      "name": "Distinguish app and test defects",
      "task": "Attach one piece of evidence that separates an app defect from a test defect."
    }
  ],
  "36": [
    {
      "id": "d36-t01",
      "name": "Groups hooks and tags",
      "task": "Group related tests with `test.describe`, and practice hooks, tags and filtering."
    },
    {
      "id": "d36-t02",
      "name": "Smoke selection",
      "task": "Run a small smoke group by tag."
    },
    {
      "id": "d36-t03",
      "name": "Independent test runs",
      "task": "Check that running one test alone gives the same result as running the group."
    }
  ],
  "37": [
    {
      "id": "d37-t01",
      "name": "Typed page object",
      "task": "Learn constructors, `this`, access modifiers and `readonly` by building one page object with typed `Page` and `Locator` fields."
    },
    {
      "id": "d37-t02",
      "name": "Reuse across scenarios",
      "task": "Use it from two tests that assert different outcomes."
    }
  ],
  "38": [
    {
      "id": "d38-t01",
      "name": "Built-in fixtures",
      "task": "Use the built-in `page`, `context` and `request` fixtures."
    },
    {
      "id": "d38-t02",
      "name": "Typed custom fixture",
      "task": "Use `test.extend` to write a typed fixture with setup, `use` and teardown."
    },
    {
      "id": "d38-t03",
      "name": "Fixture lifetimes",
      "task": "Compare test-scoped and worker-scoped lifetimes."
    }
  ],
  "39": [
    {
      "id": "d39-t01",
      "name": "Named data cases",
      "task": "Parameterize valid, invalid and boundary cases, and give each test a meaningful name."
    },
    {
      "id": "d39-t02",
      "name": "Typed data factories",
      "task": "Create a small data factory with typed defaults and per-case overrides."
    },
    {
      "id": "d39-extension",
      "name": "Boundary and decision tables",
      "task": "Build the age-boundary cases and authorization decision table in Risk and test design."
    }
  ],
  "40": [
    {
      "id": "d40-t01",
      "name": "Unique records and teardown",
      "task": "Give each state-changing test a unique record and clean it up in teardown."
    },
    {
      "id": "d40-t02",
      "name": "Parallel isolation checks",
      "task": "Run two tests alone, together and in parallel."
    },
    {
      "id": "d40-t03",
      "name": "Browser versus server state",
      "task": "Explain which data the fresh browser context isolates and which lives on the server."
    }
  ],
  "41": [
    {
      "id": "d41-t01",
      "name": "Environment inputs",
      "task": "Read a base URL and credentials from environment variables."
    },
    {
      "id": "d41-t02",
      "name": "Validate and protect secrets",
      "task": "Validate required values early, keep secrets and saved login state out of Git, and document how to run the suite locally."
    }
  ],
  "42": [
    {
      "id": "d42-t01",
      "name": "Fresh checkout smoke run",
      "task": "From a fresh checkout, install locked dependencies and run one smoke test with a single command."
    },
    {
      "id": "d42-t02",
      "name": "Extend the framework",
      "task": "Add a new test using your fixture and page object."
    },
    {
      "id": "d42-t03",
      "name": "Simplify helpers",
      "task": "Remove any helper that makes a test harder to understand."
    },
    {
      "id": "d42-extension",
      "name": "Selenium and Tosca mapping",
      "task": "Map locators, reuse, data and execution concepts; explain the scope boundaries in Concept mapping."
    }
  ],
  "43": [
    {
      "id": "d43-t01",
      "name": "Save authentication state",
      "task": "Use a setup project to log in and save `storageState`."
    },
    {
      "id": "d43-t02",
      "name": "Reuse in a fresh context",
      "task": "Run an authenticated test in a fresh context."
    },
    {
      "id": "d43-t03",
      "name": "Signed-out protection",
      "task": "Add a test that starts signed out and checks that a protected page requires login."
    }
  ],
  "44": [
    {
      "id": "d44-t01",
      "name": "Separate user contexts",
      "task": "Create separate browser contexts for two accounts."
    },
    {
      "id": "d44-t02",
      "name": "Role-specific workflow",
      "task": "Exercise a role-specific action or a two-user workflow."
    },
    {
      "id": "d44-t03",
      "name": "Parallel account ownership",
      "task": "Explain when parallel workers need separate accounts."
    }
  ],
  "45": [
    {
      "id": "d45-t01",
      "name": "Create read update delete",
      "task": "Use the `request` fixture to create, read, update and delete a record."
    },
    {
      "id": "d45-t02",
      "name": "Status headers and body",
      "task": "Check the status, relevant headers and specific body fields."
    },
    {
      "id": "d45-t03",
      "name": "Record identity and cleanup",
      "task": "Keep the created ID for later steps and cleanup."
    },
    {
      "id": "d45-extension",
      "name": "API collection and file contracts",
      "task": "Validate schemas, pagination, filtering/sorting and file metadata. See Advanced API practice."
    }
  ],
  "46": [
    {
      "id": "d46-t01",
      "name": "Negative API cases",
      "task": "Cover a missing record, an invalid payload and an unauthorized action where the API supports them."
    },
    {
      "id": "d46-t02",
      "name": "Error contract and unchanged state",
      "task": "Check the documented error and verify that the rejected action left the data unchanged."
    },
    {
      "id": "d46-extension",
      "name": "API authorization and resilience",
      "task": "Exercise auth/roles, idempotency, rate limits, bounded polling and cleanup in Advanced API practice."
    }
  ],
  "47": [
    {
      "id": "d47-t01",
      "name": "API setup for UI",
      "task": "Create data through the API and verify it in the browser."
    },
    {
      "id": "d47-t02",
      "name": "UI writes verified by API",
      "task": "Change something in the UI and verify the saved value through the API, using an app that exposes both for the same data."
    }
  ],
  "48": [
    {
      "id": "d48-t01",
      "name": "Register routes first",
      "task": "Register a route before navigation or the triggering action."
    },
    {
      "id": "d48-t02",
      "name": "Empty and error responses",
      "task": "Use `route.fulfill()` to return an empty list or a 500 response, and assert what the user sees."
    },
    {
      "id": "d48-t03",
      "name": "Abort requests",
      "task": "Try aborting a request and compare."
    }
  ],
  "49": [
    {
      "id": "d49-t01",
      "name": "Real and mocked journeys",
      "task": "Test one successful journey against a real backend and one controlled failure using a mock."
    },
    {
      "id": "d49-t02",
      "name": "State evidence and assumptions",
      "task": "Write down what each test proves and what it assumes."
    }
  ],
  "50": [
    {
      "id": "d50-t01",
      "name": "Three browser engines",
      "task": "Run a critical flow on Chromium, Firefox and WebKit."
    },
    {
      "id": "d50-t02",
      "name": "Investigate differences",
      "task": "Investigate a difference using the same assertion and input data in each project."
    }
  ],
  "51": [
    {
      "id": "d51-t01",
      "name": "Viewport projects",
      "task": "Run a desktop and a mobile viewport project."
    },
    {
      "id": "d51-t02",
      "name": "Mobile navigation and orientation",
      "task": "Verify mobile navigation, a viewport or orientation change, and a touch interaction."
    }
  ],
  "52": [
    {
      "id": "d52-t01",
      "name": "Controlled context options",
      "task": "Test a location-aware or localized page with controlled geolocation, permissions, locale and time zone."
    },
    {
      "id": "d52-t02",
      "name": "Fresh context resets",
      "task": "Start a fresh context and explain which settings were reset."
    }
  ],
  "53": [
    {
      "id": "d53-t01",
      "name": "Keyboard-only form",
      "task": "Test a form using only the keyboard."
    },
    {
      "id": "d53-t02",
      "name": "Accessible names and focus",
      "task": "Check accessible names, validation feedback and where focus moves after a dialog closes."
    },
    {
      "id": "d53-t03",
      "name": "Investigate axe findings",
      "task": "Run an axe accessibility scan and investigate one finding."
    }
  ],
  "54": [
    {
      "id": "d54-t01",
      "name": "Stable screenshot baseline",
      "task": "Create a `toHaveScreenshot()` baseline for a stable component."
    },
    {
      "id": "d54-t02",
      "name": "Inspect a visual defect",
      "task": "Control changing data, introduce a visible defect, inspect the diff, then restore it."
    },
    {
      "id": "d54-t03",
      "name": "Review baseline changes",
      "task": "Review baseline updates before accepting them."
    }
  ],
  "55": [
    {
      "id": "d55-t01",
      "name": "Controlled clock",
      "task": "Use Playwright's clock to test a countdown or idle timeout without waiting in real time."
    },
    {
      "id": "d55-t02",
      "name": "Offline behavior",
      "task": "In a separate test, take a browser context offline and verify what the user sees."
    }
  ],
  "56": [
    {
      "id": "d56-t01",
      "name": "Coverage matrix",
      "task": "Write a short matrix of which journeys run on which browsers, viewports and input methods."
    },
    {
      "id": "d56-t02",
      "name": "Choose regression checks",
      "task": "Pick one accessibility or visual check for your capstone and state which regression it catches."
    },
    {
      "id": "d56-extension",
      "name": "Risk and test pyramid",
      "task": "Choose unit, API and UI coverage from impact and likelihood. See Risk and test design."
    }
  ],
  "57": [
    {
      "id": "d57-t01",
      "name": "Compare worker counts",
      "task": "Compare one worker with several."
    },
    {
      "id": "d57-t02",
      "name": "Parallelism and data scope",
      "task": "Learn file-level parallelism, fully parallel mode, and test-scoped versus worker-scoped data."
    },
    {
      "id": "d57-t03",
      "name": "Fix shared data collisions",
      "task": "Reproduce and fix a data collision."
    }
  ],
  "58": [
    {
      "id": "d58-t01",
      "name": "Observe flaky classification",
      "task": "Make a throwaway test fail on its first attempt and see how the report classifies it."
    },
    {
      "id": "d58-t02",
      "name": "Repeat without retries",
      "task": "Run with retries disabled to find the cause, then repeat the corrected test."
    }
  ],
  "59": [
    {
      "id": "d59-t01",
      "name": "HTML and JUnit reports",
      "task": "Generate HTML and JUnit reports."
    },
    {
      "id": "d59-t02",
      "name": "Steps and attachments",
      "task": "Use named steps and attach a small piece of useful evidence."
    },
    {
      "id": "d59-t03",
      "name": "Sanitize report evidence",
      "task": "Check that report artifacts contain only data suitable for the people who will see them."
    }
  ],
  "60": [
    {
      "id": "d60-t01",
      "name": "CI installation and type checking",
      "task": "Create a GitHub Actions workflow that installs locked dependencies with `npm ci`, installs Chromium with system dependencies and type-checks the project."
    },
    {
      "id": "d60-t02",
      "name": "Pull request smoke trigger",
      "task": "Run the smoke suite on every pull request. Open a practice PR with a failing assertion, verify the job fails, then repair it."
    }
  ],
  "61": [
    {
      "id": "d61-t01",
      "name": "Publish failure artifacts",
      "task": "Upload the HTML report and traces when a test fails."
    },
    {
      "id": "d61-t02",
      "name": "Diagnose from a downloaded trace",
      "task": "Break an assertion on a practice branch, download the artifact and diagnose the failure without rerunning locally."
    }
  ],
  "62": [
    {
      "id": "d62-t01",
      "name": "Shard and merge reports",
      "task": "Split a run into two shards and merge the blob reports into one HTML report."
    },
    {
      "id": "d62-t02",
      "name": "PR versus scheduled suites",
      "task": "Set up a short pull-request job and a broader scheduled cross-browser run, and compare how long each takes."
    }
  ],
  "63": [
    {
      "id": "d63-t01",
      "name": "Follow fresh-checkout instructions",
      "task": "Follow your README in a fresh folder, run the type check and the suites, and inspect a CI report."
    },
    {
      "id": "d63-t02",
      "name": "Repair setup documentation",
      "task": "Fix any setup step you forgot to document."
    }
  ],
  "64": [
    {
      "id": "d64-t01",
      "name": "Select a practice app",
      "task": "Choose a practice app with a UI and an API you can use together."
    },
    {
      "id": "d64-t02",
      "name": "Identify user risks",
      "task": "Identify three user risks and the best place to test each."
    },
    {
      "id": "d64-t03",
      "name": "Scope one journey",
      "task": "Pick a journey such as finding a product, adding it to the cart and checking out."
    },
    {
      "id": "d64-extension",
      "name": "AI-assisted test design",
      "task": "Review AI-generated risks and cases against sanitized requirements in AI test design."
    }
  ],
  "65": [
    {
      "id": "d65-t01",
      "name": "Complete critical journey",
      "task": "Build one complete successful journey with meaningful assertions, including the final confirmation."
    },
    {
      "id": "d65-t02",
      "name": "Run two browser engines",
      "task": "Run it in two browser engines."
    }
  ],
  "66": [
    {
      "id": "d66-t01",
      "name": "Validation access and network errors",
      "task": "Add a validation case, an access-control case where supported, and a predictable network failure."
    },
    {
      "id": "d66-t02",
      "name": "Assert outcomes and state",
      "task": "Verify what the user sees and whether any data changes."
    }
  ],
  "67": [
    {
      "id": "d67-t01",
      "name": "API seed and teardown",
      "task": "Seed a unique record through the API, use it through the UI, and clean it up even when an assertion fails."
    },
    {
      "id": "d67-t02",
      "name": "Repeat without reset",
      "task": "Run the flow twice without a manual reset."
    }
  ],
  "68": [
    {
      "id": "d68-t01",
      "name": "Isolated parallel repeated runs",
      "task": "Run tests one by one, then in parallel, then repeat the critical flow with retries disabled."
    },
    {
      "id": "d68-t02",
      "name": "Record failure causes",
      "task": "Investigate any failure and write down the cause."
    }
  ],
  "69": [
    {
      "id": "d69-t01",
      "name": "Package CI reports and README",
      "task": "Include the CI workflow, a readable report, a short coverage matrix and a README with exact run commands."
    },
    {
      "id": "d69-t02",
      "name": "Explain design choices",
      "task": "Explain one locator choice, one fixture, and one failure you diagnosed from a trace."
    },
    {
      "id": "d69-extension",
      "name": "Versioned prompts and evaluations",
      "task": "Commit a prompt and evaluate known defects and false positives. See Versioned prompts and evaluations."
    }
  ],
  "70": [
    {
      "id": "d70-t01",
      "name": "Fresh-checkout demonstration",
      "task": "From a fresh checkout, run one smoke test, show the full-suite CI result and walk through a failed trace."
    },
    {
      "id": "d70-t02",
      "name": "Add an independent scenario",
      "task": "Add one new scenario without following a tutorial."
    },
    {
      "id": "d70-t03",
      "name": "Present interaction labs",
      "task": "Show your interaction labs separately where the portfolio app lacks a feature."
    }
  ]
};
  var ids = Object.keys(days).flatMap(function (d) { return days[d].map(function (t) { return t.id; }); });
  function expand(values) {
    var result = Object.assign({}, values);
    Object.keys(days).forEach(function (day) {
      days[day].forEach(function (topic) {
        var key = 'topic:' + topic.id;
        if (!Object.prototype.hasOwnProperty.call(result, key)) result[key] = result['day:' + day] === true;
      });
    });
    return result;
  }
  root.TopicProgress = { days: days, ids: ids, expand: expand };
})(globalThis);
