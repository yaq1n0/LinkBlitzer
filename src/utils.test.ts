import { describe, expect, it } from "vitest";
import {
  parseUrlsNewlines,
  parseUrlsCommas,
  parseUrls,
  getValidUrl,
  validateUrls,
  generateBlitzLink,
} from "./utils";

describe("parseUrlsNewlines", () => {
  it.each([
    ["two URLs", "https://a.com\nhttps://b.com", ["https://a.com", "https://b.com"]],
    ["trims whitespace", "  https://a.com  \n  https://b.com  ", ["https://a.com", "https://b.com"]],
    ["filters empty lines", "https://a.com\n\n\nhttps://b.com\n", ["https://a.com", "https://b.com"]],
    ["empty input", "", []],
    ["whitespace only", "   \n   ", []],
    ["single URL", "https://a.com", ["https://a.com"]],
    ["URL with query params", "https://a.com?foo=bar\nhttps://b.com?x=1&y=2", ["https://a.com?foo=bar", "https://b.com?x=1&y=2"]],
  ])("%s", (_, input, expected) => {
    expect(parseUrlsNewlines(input)).toEqual(expected);
  });
});

describe("parseUrlsCommas", () => {
  it.each([
    ["two URLs", "https://a.com,https://b.com", ["https://a.com", "https://b.com"]],
    ["trims whitespace", " https://a.com , https://b.com ", ["https://a.com", "https://b.com"]],
    ["filters empty segments", "https://a.com,,,https://b.com,", ["https://a.com", "https://b.com"]],
    ["single URL no comma", "https://a.com", ["https://a.com"]],
    ["empty input", "", []],
    ["URL with query params", "https://a.com?q=1,https://b.com?x=2", ["https://a.com?q=1", "https://b.com?x=2"]],
  ])("%s", (_, input, expected) => {
    expect(parseUrlsCommas(input)).toEqual(expected);
  });
});

describe("parseUrls", () => {
  it.each([
    ["comma-separated", "https://a.com,https://b.com", ["https://a.com", "https://b.com"]],
    ["newline-separated (treated as single by comma parser)", "https://a.com\nhttps://b.com", ["https://a.com\nhttps://b.com"]],
    ["single URL", "https://a.com", ["https://a.com"]],
    ["empty input", "", []],
    ["whitespace only", "   ", []],
    ["URLs with query params (commas)", "https://a.com?q=1,https://b.com", ["https://a.com?q=1", "https://b.com"]],
    ["URLs with query params (newlines, single entry)", "https://a.com?q=1&r=2\nhttps://b.com?x=3", ["https://a.com?q=1&r=2\nhttps://b.com?x=3"]],
  ])("%s", (_, input, expected) => {
    expect(parseUrls(input)).toEqual(expected);
  });
});

describe("getValidUrl", () => {
  it.each([
    ["full https URL", "https://example.com", "https://example.com/"],
    ["full http URL", "http://example.com", "http://example.com/"],
    ["auto-prepends https", "example.com", "https://example.com/"],
    ["URL with path", "https://example.com/path", "https://example.com/path"],
    ["URL with query", "https://example.com?q=1", "https://example.com/?q=1"],
    ["URL with fragment", "https://example.com#section", "https://example.com/#section"],
  ])("%s → %s", (_, input, expectedHref) => {
    const result = getValidUrl(input);
    expect(result).toBeInstanceOf(URL);
    expect(result?.href).toBe(expectedHref);
  });

  it.each([
    ["empty string", ""],
    ["just spaces", "   "],
  ])("returns undefined for %s", (_, input) => {
    expect(getValidUrl(input)).toBeUndefined();
  });
});

describe("validateUrls", () => {
  it.each([
    ["single valid URL", ["https://example.com"], { valid: true }],
    ["multiple valid URLs", ["https://a.com", "https://b.com"], { valid: true }],
    ["URL without protocol", ["example.com"], { valid: true }],
    ["empty array", [], { valid: false, error: "Please enter at least one URL" }],
  ])("%s", (_, urls, expected) => {
    expect(validateUrls(urls)).toEqual(expected);
  });
});

describe("generateBlitzLink", () => {
  it.each([
    [
      "multiple URLs",
      ["https://example.com", "https://google.com"],
      "https://linkblitzer.com",
      "https://linkblitzer.com?urls=https%3A%2F%2Fexample.com%7Chttps%3A%2F%2Fgoogle.com",
    ],
    [
      "single URL",
      ["https://example.com"],
      "https://linkblitzer.com",
      "https://linkblitzer.com?urls=https%3A%2F%2Fexample.com",
    ],
    [
      "URLs with query params",
      ["https://a.com?q=1", "https://b.com?x=2"],
      "https://linkblitzer.com",
      "https://linkblitzer.com?urls=https%3A%2F%2Fa.com%3Fq%3D1%7Chttps%3A%2F%2Fb.com%3Fx%3D2",
    ],
  ])("%s", (_, urls, baseUrl, expected) => {
    expect(generateBlitzLink(urls, baseUrl)).toBe(expected);
  });
});
