---
title: Why Clean Code Matters More Than Algorithms
excerpt: In the real world, code is read much more often than it is written. Let's talk about craftsmanship.
date: 2023-11-05
author: Thomas R.
readTime: 6 min
tags: [Programming, Software Engineering, Best Practices]
coverImage: https://picsum.photos/seed/code/800/400
---

# You Are An Author

When you write code for a TP (Travaux Pratiques), you often write it once, get the grade, and forget it. This creates bad habits. 

In professional software engineering, code is **communication**. You aren't writing for the compiler; the compiler doesn't care if your variable is named `x` or `userAge`. You are writing for the next human who has to read it—which might be you in six months.

## The Boy Scout Rule

> "Always leave the campground cleaner than you found it."

If you see messy code, fix it. If you see a function that does three things, break it into three functions.

### Key Principles

1.  **DRY (Don't Repeat Yourself)**: Duplication is the root of all evil in software maintenance.
2.  **KISS (Keep It Simple, Stupid)**: Complexity is not a sign of intelligence; it's a sign of failure to understand the problem clearly.
3.  **Meaningful Names**: `calculate()` is bad. `calculateMonthlyRevenue()` is good.

Let's bring craftsmanship back to our CS projects at N7.