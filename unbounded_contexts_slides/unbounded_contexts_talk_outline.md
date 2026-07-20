# The Curse of Unbounded Contexts: Using Domains as LLM Consumers

## I. Setup: What Bounded Contexts Give Us

- Quick DDD refresher: a bounded context is a semantic boundary — terms have precise meaning *within* it, and you don't assume that meaning transfers across it
- Classic example: "Customer" means a lead with potential value in Sales, an address-and-order in Shipping, a payment account in Billing — same word, three different models
- Ubiquitous language: everyone in the context shares vocabulary; you establish it deliberately
- The payoff: scoped, coherent conversations about a domain

## II. The Curse: Why LLMs Encourage the Opposite

- LLMs feel like one big infinite conversation — the interface *invites* unboundedness
- Nothing in the tooling teaches context discipline
- Concrete pattern: you open a chat to debug a function, pivot to architecture questions, ask it to write tests, then ask about a completely different file — still one conversation
- Result: we treat every LLM session like a single, ever-expanding domain

## III. The Four Failure Modes (and Their DDD Names)

### 1. Language mismatch at the start → no ubiquitous language established

- You ask for help with "the model" — do you mean the ML pipeline, the ORM layer, or the view model?
- You ask about "the service" assuming it knows which of your twelve microservices you mean
- The LLM answers confidently using its definition; you don't notice the mismatch until three suggestions in

**How to detect it:** The first response surprises you — the suggestion doesn't quite fit, or it's solving a slightly different problem than you thought you asked. That surprise is a vocabulary signal.

**What to do:** When the first answer surprises you, don't correct it yet — ask "what did you understand 'X' to mean?" first. You'll see the mismatch clearly in the answer. Then correct it once, explicitly, and move forward.

**Tip:** Open every non-trivial conversation with a terminology block — 3-5 lines, no more:
> "In this conversation: 'model' = our scikit-learn pipeline, 'service' = the inference API, 'feature' = a column in the feature store."

This takes 30 seconds. You are writing the ubiquitous language of your bounded context before you ask a single question.

---

### 2. Detail loss mid-conversation → unbounded context degrades its own signal

- Message 3: "never use exceptions for flow control in this codebase"
- Message 40: the LLM is cheerfully suggesting try/catch for flow control
- The constraint didn't disappear from the window — it just got buried under everything else

**How to detect it:** You're writing "remember, we said X" more than once. That's the signal — not that the model forgot, but that your constraints are no longer load-bearing in the context.

**What to do:** Stop correcting and re-anchor. Send one message that restates the key constraints explicitly: "Reminding you: no exceptions for flow control, Python 3.9, goal is still X." This isn't redundant — it's maintenance.

**Tip:** Any constraint that must hold for the *whole* conversation should be the *first* message, not message 3. Constraints introduced mid-conversation are effectively invisible by message 30.

**Tip:** In conversations running past 15-20 messages, send a deliberate re-anchor: pull out the decisions made so far and state them fresh. This also gives *you* a chance to check whether you still agree with those decisions.

---

### 3. Goals bleeding into each other → one context serving multiple domains

- You start exploring an unfamiliar codebase, then pivot to asking it to rewrite parts of it
- The exploratory framing ("what does this do?") and the implementation framing ("change this") are now entangled — suggestions come out half-explanation, half-implementation
- Or: brainstorming and deciding in the same thread; the model anchors on early brainstorm ideas when you're trying to make a final call

**How to detect it:** The suggestions feel like they're hedging — half-answer, half-explanation, uncommitted. Or the model keeps offering options when you asked for a decision. The framing of earlier messages is still shaping the framing of later ones.

**What to do:** Start a new conversation. Carry forward only conclusions, not the path. "We determined the bottleneck is in the query layer and the fix is an index on user_id. Now help me implement that." The exploration conversation is over; this is an implementation conversation.

**Tip:** Before you ask anything, declare your mode:
- *Exploring:* "I want to understand this before touching anything."
- *Brainstorming:* "Generate options — I'll evaluate them separately."
- *Deciding:* "I need a recommendation, not a list of tradeoffs."
- *Implementing:* "We've decided X. Help me build it."

The model can only calibrate its response if it knows which register you're working in.

---

### 4. Inability to change course → trying to refactor a bloated context instead of drawing a new boundary

- You've been designing a REST API for 20 messages. You say "actually, let's switch to GraphQL."
- REST patterns keep creeping back in — not because the LLM forgot, but because the context is *saturated* with REST
- You keep writing "no, not like that — I mean the GraphQL way" and it keeps not quite sticking

**How to detect it:** You've written some version of "no, not like that" more than twice in a row. The correction isn't landing. That's not a comprehension problem — it's a saturation problem.

**What to do:** Stop trying to argue the model out of the old direction. You cannot reason it out of a saturated context. Treat the pivot as a context-boundary event: open a new conversation, lead with the destination, and don't mention the journey that got you here.

**Tip:** Pivots are not corrections. "Let's switch to GraphQL" after 20 REST messages isn't asking it to change its mind — it's asking it to replace its context. Start fresh instead.

---

## IV. Bounded Context Practices for LLM Consumers

### The Conversation Charter

Write 2-3 sentences at the start of any non-trivial conversation:
1. The scope: what system, module, or problem are we working on?
2. The vocabulary: which terms in this context could mean multiple things?
3. The mode: are we exploring, brainstorming, deciding, or implementing?

This is exactly what a bounded context definition looks like. You are doing DDD, not just prompting.

### The Mode Declaration

Four modes, four different things to ask for:
- *Exploring* → "tell me what's here, don't suggest changes"
- *Brainstorming* → "give me options without evaluating them for me"
- *Deciding* → "I need a recommendation with a clear rationale"
- *Implementing* → "the decision is made, help me execute it"

When you shift modes, start a new conversation.

### One Conversation, One Domain

Split conversations the way you'd split bounded contexts. The research conversation and the implementation conversation should be separate. The "what is this codebase doing?" conversation and the "rewrite this part" conversation should be separate.

This isn't losing context — it's maintaining integrity.

### The Carry-Only-Conclusions Handoff

When you start a new conversation after closing one, write a brief handoff:
> "Previous conversation established: [2-3 key decisions]. Build from here."

Deliberately exclude the path that got you there — only carry the destination. This is context-mapping: you are defining the boundary between the old conversation and the new one. You decide what crosses it.

### Recognize the Anti-Corruption Layer Moment

When you find yourself writing "no, I don't mean X, I mean Y" for the third time — that's not a clarification problem. That's a boundary problem.

Stop clarifying. Start fresh. The anti-corruption layer in DDD exists because some vocabulary *cannot* be translated across a boundary; it can only be replaced. The same applies here.

### The Periodic Re-Anchor

For conversations that run long, every 15-20 messages: send a message that restates the constraints and current goal explicitly.

Not for the model's benefit — for yours. It's a forcing function to check whether the constraints you set at message 3 still reflect what you want at message 35.

---

## V. The Useful Flip Side

- This framing reveals *where* LLMs are most useful: tasks with naturally tight, well-defined domains
  - "Convert this Python function to TypeScript" — bounded input, bounded output
  - "Write a regex that matches this format" — no ambiguous vocabulary, clear success condition
- And where they'll always struggle: tasks that are inherently multi-domain, or where the domain is still being discovered
  - "Help me design a system that does X, Y, and Z" — the domain is being negotiated as you go
  - These aren't unsolvable, but they require *more* context discipline, not less

**Corollary for tool selection:** when a task has a tightly bounded domain, LLMs are great — even for one-shot uses where you'd never bother building a tool. When the domain is fuzzy or evolving, the model isn't the bottleneck; your ability to define the context is.

---

## VI. Close

- The blinking cursor is a UI affordance, not a reflection of how the model works — it invites you to just keep typing
- Bounded thinking makes you a more effective LLM consumer *and* clarifies realistic expectations about where these tools help and where they don't
- The cursor isn't a context. It just looks like one.
