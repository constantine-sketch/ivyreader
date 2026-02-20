'''
# IvyReader Project Context & Memory

**Objective:** This document serves as the persistent memory for the IvyReader project. It provides essential context and establishes the standard operating procedures for any development work. **You MUST read and adhere to this document at the start of every session involving the IvyReader project.**

## 1. Core Directive: Use the Verification Loop

To ensure code quality, maintain architectural integrity, and conserve resources, all significant development work on this project **MUST** begin by invoking the `ivyreader-verification-loop` skill.

**Trigger this skill before you:**
- Write or modify any code.
- Create or alter database schemas.
- Deploy the application or any part of it.
- Make any architectural decisions.

This is not optional. The skill guides you through a mandatory 3-step check to validate your plan against the project's architecture, dependencies, and resource efficiency.

## 2. Project Architecture

A high-level overview of the IvyReader architecture is available in the verification loop skill's reference files. You are required to review it as the first step of the verification loop.

- **Command to review architecture:** `cat /home/ubuntu/skills/ivyreader-verification-loop/references/architecture_overview.md`

This document outlines the core components, technology stack, key patterns, and development workflow. Do not deviate from these established patterns without a compelling, documented reason and explicit approval.

## 3. Key Repositories

The project is split across three GitHub repositories:

1.  **`constantine-sketch/ivyreader`**: The main repository containing the React Native mobile app and the tRPC backend server.
2.  **`constantine-sketch/ivyreader-backend`**: Currently an empty placeholder, but intended for future backend expansion.
3.  **`constantine-sketch/ivylandings15`**: The marketing and landing page website.

All code is cloned in the `/home/ubuntu/ivyreader_audit/` directory in the sandbox.

## 4. Standard Operating Procedure (SOP)

Your workflow for any task on this project should be as follows:

1.  **Understand the Goal:** Clarify the user's request.
2.  **Load this Context:** Read this `IVYREADER_CONTEXT.md` file.
3.  **Activate Verification Loop:** State that you are beginning the verification process using the `ivyreader-verification-loop` skill.
4.  **Execute the 3-Step Check:** Follow the instructions in the skill's `SKILL.md` file precisely.
5.  **Implement the Plan:** Once the plan is verified, proceed with the implementation.

Adhering to this process will ensure consistency, reduce bugs, and lead to more efficient development.
'''
