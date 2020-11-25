const {MongoClient} = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");

/**
 * constants
 */
const uri = "mongodb://localhost:27017/wine";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("tastings").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your wine 🍷!!").start();

    /**
     * Import the JSON data into the database
     */
    const data = await fs.readFile(path.join(__dirname, "wine.json"), "utf8");

    await createTastings(data, db);
    await createTasters(db);
    await createRegions(db);

    load.stop();
    console.info(
        `Wine collection set up! 🍷🍷🍷🍷🍷🍷🍷 \n I've also created a tasters collection for you 🥴 🥴 🥴`
    );
    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

async function createTastings(data, database) {
  await database.collection("tastings").insertMany(JSON.parse(data));
}

async function createTasters(database) {
  await createTastersCollection(database);
  await updateTasterReferences(database);
}

async function createTastersCollection(database) {
  /**
   * This perhaps appears a little more complex than it is. Below, we are
   * grouping the wine tasters and summing their total tastings. Finally,
   * we tidy up the output so it represents the format we need for our new collection
   */
  const wineTastersRef = await database.collection("tastings").aggregate([
    {$match: {taster_name: {$ne: null}}},
    {
      $group: {
        _id: "$taster_name",
        social: {$push: "$taster_twitter_handle"},
        total_tastings: {$sum: 1},
      },
    },
    {
      $project: {
        twitter: {$first: "$social"},
        tastings: "$total_tastings",
      },
    },
    {$set: {name: "$_id", _id: "$total_tastings"}},
  ]);
  /**
   * Below, we output the results of our aggregate into a
   * new collection
   */
  const wineTasters = await wineTastersRef.toArray();
  await database.collection("tasters").insertMany(wineTasters);
}

async function updateTasterReferences(database) {
  /** This data manipulation is to reference each document in the
   * tastings collection to a taster id. Further to this we also take the opportunity to
   * tidy up points (converting it to a int) and regions, adding them to a an array
   */
  const updatedWineTastersRef = database.collection("tasters").find({});
  const updatedWineTasters = await updatedWineTastersRef.toArray();

  for (const {_id, name} of updatedWineTasters) {
    await database.collection("tastings").updateMany({taster_name: name}, [
      {
        $set: {
          taster_id: _id,
          regions: ["$region_1", "$region_2"],
          points: {$toInt: "$points"},
        },
      },
    ]);
  }

  await removeOldRegionFields(database)
}

async function removeOldRegionFields(database) {
  /**
   * we can get rid of region_1/2 off our root document, since we've
   * placed them in an array
   */
  await database
      .collection("tastings")
      .updateMany({}, {$unset: {region_1: "", region_2: " "}});

  /**
   * Finally, we remove nulls regions from our collection of arrays
   * */
  await database
      .collection("tastings")
      .updateMany({regions: {$all: [null]}}, [
        {$set: {regions: [{$arrayElemAt: ["$regions", 0]}]}},
      ]);
    });


    /**
     * we can get rid of region_1/2 off our root document, since we've
     * placed them in an array
     */
    await db
      .collection("tastings")
      .updateMany({}, { $unset: { region_1: "", region_2: " " } });

    /**
     * Finally, we remove nulls regions from our collection of arrays
     * */
    await db
      .collection("tastings")
      .updateMany({ regions: { $all: [null] } }, [
        { $set: { regions: [{ $arrayElemAt: ["$regions", 0] }] } },
      ])


    db.collection("tastings").aggregate([
      { $group: { _id: "$variety" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "varieties" }
    ]).toArray();

    db.collection("tastings").aggregate([
      { $group: { _id: "$country" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "countries" }
    ]).toArray()



    await db.collection("tastings").aggregate([
      { $group: { _id: "$province" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "provinces" }
    ]).toArray()

    await db.collection("tastings").aggregate([
      { $unwind: "$regions" },
      { $group: { _id: "$regions" } },
      { $project: { name: '$_id', _id: 0 } },
      { $out: "regions" }
    ]).toArray();


    await db.collection("tastings").aggregate([
      { $unwind: "$regions" },
      { $group: { _id: "$regions" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "regions" }
    ]).toArray() 



    load.stop();
    console.info(
      `Wine collection set up! 🍷🍷🍷🍷🍷🍷🍷 \n I've also created a tasters collection for you 🥴 🥴 🥴`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
