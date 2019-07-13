const { shouldFail, deployDat, updateDatConfig } = require("../../helpers");

contract("fair / erc20 / name", accounts => {
  const maxLengthName =
    "Names are 64 characters max.....................................";
  let dat;
  let fair;
  let tx;

  before(async () => {
    [dat, fair] = await deployDat({}, accounts[0]);
  });

  it("should have an empty name by default name", async () => {
    assert.equal(await fair.name(), "");
  });

  describe("updateName", () => {
    describe("`control` can change name", () => {
      const newName = "New Name";

      before(async () => {
        tx = await updateDatConfig(dat, fair, { name: newName }, accounts[0]);
      });

      it("should have the new name", async () => {
        assert.equal(await fair.name(), newName);
      });

      it("should emit an event", async () => {
        const log = tx.logs[0];
        assert.notEqual(log, undefined);
        // TODO
        // assert.equal(log.event, 'NameUpdated');
        // assert.equal(log.args._previousName, name);
        // assert.equal(log.args._name, newName);
      });

      describe("max length", () => {
        before(async () => {
          tx = await updateDatConfig(
            dat,
            fair,
            { name: maxLengthName },
            accounts[0]
          );
        });

        it("should have the new name", async () => {
          assert.equal(await fair.name(), maxLengthName);
        });

        it("should fail to update longer than the max", async () => {
          await shouldFail(
            updateDatConfig(
              dat,
              fair,
              { name: `${maxLengthName} more characters` },
              accounts[0]
            )
          );
        });
      });
    });

    it("should fail to change name from a different account", async () => {
      await shouldFail(
        updateDatConfig(dat, fair, { name: "Test" }, accounts[2]),
        "CONTROL_ONLY"
      );
    });
  });
});