import { describe, expect, it } from "vitest";

import { INDICATOR_EXPLANATIONS } from "@/lib/indicators/explanations";
import {
  GLOSSARY_TERMS,
  GLOSSARY_TOPICS,
  getGlossaryTerm,
  getTermsForIndicator,
  glossaryHref,
  groupTermsByTopic,
  searchGlossary
} from "@/lib/glossary/terms";

describe("glossary data", () => {
  it("has unique, URL-safe ids", () => {
    const ids = GLOSSARY_TERMS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("only references related terms that exist and are not itself", () => {
    for (const entry of GLOSSARY_TERMS) {
      for (const relatedId of entry.related ?? []) {
        expect(getGlossaryTerm(relatedId), `${entry.id} -> ${relatedId}`).toBeDefined();
        expect(relatedId).not.toBe(entry.id);
      }
    }
  });

  it("gives every term a plain definition and a source that is https or a site path", () => {
    for (const entry of GLOSSARY_TERMS) {
      expect(entry.plain.trim().length, entry.id).toBeGreaterThan(20);
      expect(entry.sourceLabel.trim().length, entry.id).toBeGreaterThan(0);
      expect(entry.sourceUrl, entry.id).toMatch(/^(https:\/\/|\/)/);
    }
  });

  it("uses only known topics", () => {
    const topicIds = new Set<string>(GLOSSARY_TOPICS.map((topic) => topic.id));
    for (const entry of GLOSSARY_TERMS) expect(topicIds.has(entry.topic), entry.id).toBe(true);
  });

  it("links indicator terms only to indicators the site defines", () => {
    for (const entry of GLOSSARY_TERMS) {
      if (entry.indicatorId) expect(INDICATOR_EXPLANATIONS[entry.indicatorId], entry.id).toBeDefined();
    }
  });
});

describe("glossary helpers", () => {
  it("finds terms for an indicator", () => {
    expect(getTermsForIndicator("U6RATE").map((entry) => entry.id)).toEqual(["u-6"]);
    expect(getTermsForIndicator("NOT_A_SERIES")).toEqual([]);
  });

  it("groups by topic in display order with every term placed once", () => {
    const groups = groupTermsByTopic();
    const order = GLOSSARY_TOPICS.map((topic) => topic.id).filter((id) => groups.some((group) => group.id === id));
    expect(groups.map((group) => group.id)).toEqual(order);
    expect(groups.reduce((count, group) => count + group.terms.length, 0)).toBe(GLOSSARY_TERMS.length);
  });

  it("searches names and definitions case-insensitively", () => {
    expect(searchGlossary("SAHM").map((entry) => entry.id)).toContain("sahm-rule");
    expect(searchGlossary("involuntary").map((entry) => entry.id)).toContain("part-time-for-economic-reasons");
    expect(searchGlossary("   ")).toHaveLength(GLOSSARY_TERMS.length);
    expect(searchGlossary("zzzz-no-match")).toEqual([]);
  });

  it("builds anchor links", () => {
    expect(glossaryHref("u-6")).toBe("/glossary#u-6");
  });
});
