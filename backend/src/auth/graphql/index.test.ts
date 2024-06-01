import { dbConnect, dbDisconnect } from "@/utils/tests";

describe("Auth Resolvers", () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  test("adds 1 + 2 to equal 3", () => {
    expect(1).toBe(3);
  });
});
