import { describe, expect, it } from "vitest";

import { buildProtocol, toPillarsArray } from "../lib/today/protocol";

describe("today page helpers", () => {
  it("maps pillars to labeled array", () => {
    const result = toPillarsArray({
      sleep_integrity: 70,
      hormonal_stability: 65,
      custom_metric: 50
    });

    expect(result).toEqual([
      { label: "Sleep integrity", value: 70 },
      { label: "Hormonal stability", value: 65 },
      { label: "custom_metric", value: 50 }
    ]);
  });

  it("returns high score protocol for 80+", () => {
    const protocol = buildProtocol(85, { sleep_integrity: 80 });

    expect(protocol).toHaveLength(3);
    expect(protocol[0]).toContain("training light");
  });

  it("returns moderate protocol for 60-79", () => {
    const protocol = buildProtocol(70, { sleep_integrity: 60 });

    expect(protocol).toHaveLength(3);
    expect(protocol[0]).toContain("intensity moderate");
  });

  it("targets the lowest pillar when score is under 60", () => {
    const protocol = buildProtocol(50, {
      sleep_integrity: 62,
      hormonal_stability: 48,
      load_management: 55,
      inflammation_control: 58,
      cognitive_bandwidth: 64
    });

    expect(protocol[0]).toContain("nutrition");
  });

  it("defaults to sleep integrity when pillars are empty", () => {
    const protocol = buildProtocol(40, {});

    expect(protocol[0]).toContain("sleep");
  });
});
