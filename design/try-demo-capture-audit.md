# Try demo: capture wiring and UX

The marketing demo calls `POST https://api.convomem.com/api/v1/demo/capture` with typed transcripts or grouped role-tagged messages, channel metadata and `insights: true`. The built-in sample now calls the same executor directly; it no longer enters the import mapper. Uploaded CSVs retain grouping, speaker and channel selection, with inferred settings collapsed and one scrolling container.

## Shared production code

Read-only audit of the server confirmed that `services/demo-capture.service.js` and production `services/customer-memory.service.js` both call `extractGroundedMemories` and `applyMemoryPolicy`. Grounding/source quotes, bounded repair, environmental filtering, durability/lifecycle policy, default PII masking and secret withholding are shared. The public demo uses its own guarded `demo` spend pool and defaults, without organization or agent overrides.

The demo reconciles duplicate content/topic slots within a request. Production also compares with persisted customer memories. Customer identity resolution, PostgreSQL/Qdrant persistence, retrieval against stored history, tenant/agent settings, handoff and downstream webhooks are not exercised by the anonymous demo. Nothing is added to customer records.

Conversation insights use a separate ephemeral LLM prompt (`runDemoInsights`), not the persisted production analysis worker. They must not be represented as full end-to-end production analytics parity.

## Client corrections

- Example calls, chats and emails retain their real channel instead of all being submitted as CHAT.
- Live failures and interrupted/malformed streams display a retryable error. Only an explicit server `done` completes a run. A local heuristic preview requires a separate visitor action and is labelled “no AI”.
- Split UTF-8/CRLF streams and model insight metadata are handled defensively; reset, cancel and closing the dialog abort the active request.
- Input editing remains available after failure. The transcript preview preserves customer/agent roles; returned agent-authored facts are identified. Sensitive counts say masked or withheld rather than incorrectly calling them all withheld.
- The trace describes ephemeral deduplication accurately and includes the server's conversation-signal stage.

## Evidence

Server: 2 focused existing suites / 11 tests pass (`demo-capture.service.test.js`, `demo-budget-isolation.test.js`). These are shared-code and budget-isolation regressions; they do not measure LLM memory quality. No server code was changed.

Marketing: 29 tests, TypeScript and production build pass. Browser tests against an isolated intercepted SSE endpoint verify five-conversation sample bypass, actual API URL/payload shape, channel metadata, grouped user/assistant messages, explicit failure/local-preview choice and phone layout. Intercepted responses are test fixtures, not live inference-quality evidence. CSV regressions cover quoted multiline text, escaped quotes, TSV and BOM headers. The implementation continues to target the real public endpoint.
