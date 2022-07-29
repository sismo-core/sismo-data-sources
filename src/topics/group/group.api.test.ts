import "reflect-metadata";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { DependencyContainer } from "tsyringe";

import { getFastify } from "../../api/app";
import { getMemoryContainer } from "../../infrastructure";
import { createTestGroups } from "./test-groups";
import { Group } from "./group";

describe("test groups api", () => {
  let fastify: FastifyInstance;
  let container: DependencyContainer;
  let testGroups: { [name: string]: Group };

  beforeEach(async () => {
    container = getMemoryContainer();
    fastify = getFastify(false, {}, container);
    await fastify.ready();
    testGroups = createTestGroups(container);
  });

  it("Should respond 400 without groupName", async () => {
    const response = await request(fastify.server).get("/groups");
    expect(response.statusCode).toBe(400);
  });

  it("Should get empty items", async () => {
    const response = await request(fastify.server).get(
      `/groups?groupName=${testGroups.group1_0.name}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toEqual([]);
  });

  it("Should store groups and get all", async () => {
    await testGroups["group1_0"].save();
    await testGroups["group1_1"].save();
    const response = await request(fastify.server).get(
      `/groups?groupName=${testGroups.group1_0.name}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(2);
  });

  it("Should store groups and search latest", async () => {
    await testGroups["group1_0"].save();
    await testGroups["group1_1"].save();
    const response = await request(fastify.server).get(
      `/groups?groupName=${testGroups.group1_0.name}&latest=true`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].timestamp).toBe(
      testGroups.group1_1.timestamp
    );
  });

  it("Should store groups and get latests", async () => {
    await testGroups["group1_0"].save();
    await testGroups["group1_1"].save();
    await testGroups["group2_0"].save();
    const response = await request(fastify.server).get("/groups/latests");
    expect(response.statusCode).toBe(200);
    const groupNames = Object.keys(response.body.items);
    expect(groupNames).toHaveLength(2);
    expect(groupNames).toContain(testGroups.group1_1.name);
    expect(groupNames).toContain(testGroups.group2_0.name);
    expect(response.body.items[testGroups.group1_1.name].timestamp).toBe(
      testGroups.group1_1.timestamp
    );
  });

  it("Should store group and get dataUrl", async () => {
    await testGroups["group1_0"].save();
    const response = await request(fastify.server).get(
      `/groups?groupName=${testGroups.group1_0.name}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(Object.keys(response.body.items[0])).toContain("dataUrl");
  });

  it("Should store group and latests get dataUrl", async () => {
    await testGroups["group1_0"].save();
    const response = await request(fastify.server).get(`/groups/latests`);
    expect(response.statusCode).toBe(200);
    expect(
      Object.keys(response.body.items[testGroups.group1_0.name])
    ).toContain("dataUrl");
  });
});
