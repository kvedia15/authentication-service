import Player from "../../src/core/domain/player";

describe("Player", () => {
  let player: Player;
  let chipCount: number;
  let name: string;

  beforeEach(() => {
    chipCount = 1000;
    name = "testPlayer";
    player = new Player(chipCount, name);
  });

  it("initializes correctly", () => {
    expect(player).toBeDefined();
    expect(player["chipCount"]).toBe(chipCount);
    expect(player["name"]).toBe(name);
  });

  it("initializes with default name if not provided", () => {
    player = new Player(chipCount, "");
    expect(player).toBeDefined();
    expect(player["chipCount"]).toBe(chipCount);
    expect(player["name"]).toMatch(/^Guest-/); // Check if name starts with "Guest-"
  });

  it("returns correct JSON representation", () => {
    const json = player.toJson();
    expect(json).toBeDefined();
    expect(json.chipCount).toBe(chipCount);
    expect(json.name).toBe(name);
  });

  it("returns correct JSON representation with position and status", () => {
    const json = player.toJson();
    expect(json).toBeDefined();
    expect(json.chipCount).toBe(chipCount);
    expect(json.name).toBe(name);
  });



 
});