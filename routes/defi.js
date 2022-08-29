const express = require("express");
const Defi = require("../models/defi");
const { ethers } = require("ethers");
const DefiAbi = require("./DefiAbi.json");
const { Contract } = require("@ethersproject/contracts");
const mongoose = require("mongoose");

const app = express.Router();
const provider = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);
let walletAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
const voidAccount = new ethers.VoidSigner(walletAddress, provider);
const defiContract = new Contract(
  "0x8A501d5960f0dF2f01887d8b010fDc8dBC9Ff3DE",
  DefiAbi,
  voidAccount
);
app.get("/get-tree", async (req, res, next) => {
  try {
    const { userId, pkg } = req.query;
    let members = await Defi.find({ userId: userId, package: pkg }).populate({
      path: "children",
      populate: {
        path: "children",
        populate: {
          path: "children",
          populate: {
            path: "children",
            populate: {
              path: "children",
            },
          },
        },
      },
    });
    res.status(200).json(members);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post("/buy-package", async (req, res, next) => {
  try {
    const { refererId, tx, account, pkg } = req.body;
    let receipt = null;
    console.log(refererId, tx, account, pkg);
    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(tx.hash);

        if (receipt?.status) {
          let { id } = await defiContract.getUserPkgData(
            account,
            pkg.toString()
          );
          let userId = +id;
          const newDefi = new Defi({
            _id: new mongoose.Types.ObjectId(),
            userId,
            parent: refererId,
            account,
            package: pkg,
            children: [],
          });
          newDefi.save();
          console.log(userId, "userId");
          const parent = await Defi.findOne({
            userId: refererId,
            package: pkg,
          });
          if (parent.children.length < 3) {
            await Defi.findByIdAndUpdate(
              { _id: parent._id },
              { $push: { children: newDefi._id } }
            );
          } else {
            for (let outerTree = 0; outerTree < 5; outerTree++) {
              let children = parent.children;
              for (let index = 0; index < 3; index++) {
                const targetChild = await Defi.findOne({
                  _id: children[index],
                  package: pkg,
                });

                if (targetChild.children.length < 3) {
                  console.log("targetChild", targetChild);
                  await Defi.findByIdAndUpdate(
                    { _id: targetChild._id },
                    { $push: { children: newDefi._id } }
                  );
                  outerTree = 6;
                  break;
                }
              }
            }
          }
          return res.status(200).json({ success: true });
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// const newDefi = new Defi({
//   userId: 2,
//   parent: 1,
//   account: "0x0024b734a76e1279f7aab0bffbc4638154a0d3db",
//   package: 1,
//   children: [],
// });
// console.log(newDefi, "0x1bF99f349eFdEa693e622792A3D70833979E2854");
// newDefi.save();
module.exports = app;
