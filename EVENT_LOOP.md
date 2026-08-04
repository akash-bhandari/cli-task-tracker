# Understanding the JavaScript Event Loop

JavaScript can only do one thing at a time. Understanding *how* it decides
what runs next — and in what order — comes down to three pieces: the call
stack, and two queues.

## The call stack

The call stack is where your code actually runs, one function at a time.
When a function is called, it's pushed onto the stack; when it returns,
it's popped off. Because there's only one stack, JavaScript is
**single-threaded** — nothing else in your code can run while something
is already on the stack.

## The microtask queue

Promise callbacks (`.then()`) don't run immediately when a promise
resolves. They go into the **microtask queue** and wait there until the
call stack is completely empty. Once the engine starts processing
microtasks, it clears the *entire* queue — including any new microtasks
added along the way — before doing anything else.

## The macrotask queue

Things like `setTimeout`, `setInterval`, and I/O callbacks go into the
**macrotask queue** instead. The difference: the event loop only pulls
**one** macrotask per pass, not the whole queue at once.

## The rule that ties it together

Every loop, in order: run the current code until the stack is empty →
drain *all* microtasks → run exactly *one* macrotask → repeat. Microtasks
always finish completely before the next macrotask starts. That's why
promises consistently run before timers, even a `setTimeout(fn, 0)`.

## The classic example

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

This logs `A, D, C, B`. Here's why:

1. `A` logs immediately — it's synchronous code.
2. `setTimeout` schedules `B` on the **macrotask** queue. `0ms` just means
   "as soon as possible," not "right now" — it still has to wait its turn.
3. `.then()` schedules `C` on the **microtask** queue.
4. `D` logs immediately — synchronous code again. The stack is now empty.
5. Before touching macrotasks, the engine drains microtasks first: `C`
   logs.
6. Only now does the loop grab the next macrotask: `B` logs.

The core idea: the event loop never even looks at the macrotask queue
while a microtask is still waiting. The stack must be empty *and* the
microtask queue fully drained, every single time, before a macrotask
gets its turn. That's the whole reason `C` beats `B`.