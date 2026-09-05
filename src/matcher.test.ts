import { describe, expect, it } from "vitest";
import { replaceTrumpAccountMentions } from "./matcher";

describe("replaceTrumpAccountMentions", () => {
  it.each([
    ["Trump Account", "530A IRA"],
    ["trump account", "530A IRA"],
    ["TRUMP ACCOUNT", "530A IRA"],
    ["Trump Accounts", "530A IRAs"],
    ["Trump's Account", "530A IRA"],
    ["Trump's Accounts", "530A IRAs"],
    ["Trump’s Account", "530A IRA"],
    ["I have a Trump Account today.", "I have a 530A IRA today."],
    ["Trump Account and Trump Accounts", "530A IRA and 530A IRAs"],
  ])("replaces %j with %j", (input, expected) => {
    expect(replaceTrumpAccountMentions(input)).toBe(expected);
  });

  it.each([
    "Trump Accountant",
    "Trump Accounting",
    "The Trump Organization Account",
    "Trump",
    "Account",
    "MyTrump Account",
    "Trumps Account",
  ])("leaves %j unchanged", (input) => {
    expect(replaceTrumpAccountMentions(input)).toBe(input);
  });
});
